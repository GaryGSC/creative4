var rooms = {};

//On connection
module.exports = function(client){
	console.log("Client " + client.id + " connected.");
	var name;
	var in_game = "";

	client.on("create_game", function(player_name){
		var room_id = getRandomRoomID();
		while (rooms.hasOwnProperty(room_id)) {
			room_id = getRandomRoomID();
		}
		client.join(room_id);
		name = player_name ? player_name : client.id;
		rooms[room_id] = {
			host_name: name,
			host: client,
			guesses: []
		};
		in_game = room_id;
		console.log("New game created by "+name+". The room ID is:", room_id);
		client.emit("game_created", room_id)
	});

	client.on("join_game", function(params) {
		if (rooms[params.room_id] && !rooms[params.room_id].player) {
			client.emit("successfully_joined");
			name = params.name ? params.name : client.id;
			rooms[params.room_id].player_name = name;
			rooms[params.room_id].player = client;
			in_game = params.room_id;
			console.log(name + " joined room " + params.room_id + ".");
			client.join(params.room_id);	//Join the room (will be used for chat between players and potentially spectators)
			client.to(params.room_id).emit("player_joined", name); //Essentially, tell the chatroom that another player joined.
			startGame(params.room_id);
		} else {
			client.emit("failed_to_join");
		}
	});

	client.on("spectate_game", function(params) {
		if (rooms[params.room_id]) {
			client.join(params.room_id);
			name = params.name ? params.name : client.id;
			client.to(params.room_id).emit("spectator_joined", name);
		} else {
			client.emit("failed_to_spectate");
		}
	});

	client.on("set_code", function(code){
		console.log("The code is:", code);
		var room_id = in_game;
		rooms[room_id].code = code;
		if (rooms[room_id].host_is_mastermind){
			rooms[room_id].host.emit("code_set", rooms[room_id].host_name);
			rooms[room_id].player.emit("code_was_set", rooms[room_id].host_name);
		} else {
			rooms[room_id].player.emit("code_set", rooms[room_id].player_name);
			rooms[room_id].host.emit("code_was_set", rooms[room_id].player_name);
		}
	});

	client.on("make_guess", function(guess){
		console.log(name + " guessed " + JSON.stringify(guess));

		var this_guess = {
			guess: []
		};
		this_guess.guess[0] = guess[0];
		this_guess.guess[1] = guess[1];
		this_guess.guess[2] = guess[2];
		this_guess.guess[3] = guess[3];

		var temp_code = [];
		temp_code[0] = rooms[in_game].code[0];
		temp_code[1] = rooms[in_game].code[1];
		temp_code[2] = rooms[in_game].code[2];
		temp_code[3] = rooms[in_game].code[3];

		var response = "";
		for (var i = 0; i < 4; i++){
			if (guess[i] == temp_code[i]){
				response += "S";
				temp_code[i] = "TAKEN";
				guess[i] = "TAKEN";
			}
		}
		for (var i = 0; i < 4; i++){
			if (guess[i] != "TAKEN"){
				for (var j = 0; j < 4; j++){
					if (guess[i] == temp_code[j]){
						response += "C";
						temp_code[j] = "TAKEN";
						break;
					}
				}
			}
		}
		response = (response + "    ").substring(0, 4);
		console.log("Response:", response);

		this_guess.response = response;
		rooms[in_game].guesses.push(this_guess);
		var board_state = {
			guesses: rooms[in_game].guesses
		};
		console.log("State of game:", board_state);
		rooms[in_game].host.emit("board_updated", board_state);
		rooms[in_game].player.emit("board_updated", board_state);

		if (response == "SSSS"){
			rooms[in_game].host.emit("code_was_guessed");
			rooms[in_game].player.emit("code_was_guessed");
		} else if (board_state.guesses.length == 10){
			rooms[in_game].host.emit("code_not_guessed");
			rooms[in_game].player.emit("code_not_guessed");
		}
	});

	client.on('disconnect', function(){
		if (in_game) { //in_game is the room_id if playing (not just a spectator) or "" (which evaluates to false)
			rooms[in_game].host.emit("a_player_left", name);
			rooms[in_game].player.emit("a_player_left", name);
		}
		console.log("Client " + client.id + " disconnected.");
	});
};

function getRandomRoomID(){
	return ("0000" + Math.floor(Math.random()*(10000))).slice(-4); //"0000" to "9999"
}

function startGame(room_id){
	rooms[room_id].game = 1;
	rooms[room_id].host_is_mastermind = !!(Math.round(Math.random())); //Evaluates to true or false, randomly. (!! is a hacky way to convert to boolean)
	if (rooms[room_id].host_is_mastermind){
		console.log(rooms[room_id].host_name + " is the mastermind!");
		rooms[room_id].host.emit("you_should_set_code", rooms[room_id].host_name);
		rooms[room_id].player.emit("other_player_is_setting_code", rooms[room_id].host_name);
	} else {
		console.log(rooms[room_id].player_name + " is the mastermind!");
		rooms[room_id].player.emit("you_should_set_code", rooms[room_id].player_name);
		rooms[room_id].host.emit("other_player_is_setting_code", rooms[room_id].player_name);
	}
}
