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
			host: client
		};
		in_game = room_id;
		console.log("New game created. The room ID is:", room_id);
		client.emit("game_created", room_id)
	});

	client.on("join_game", function(params) {
		if (rooms[params.room_id] && !rooms[params.room_id].player) {
			client.emit("successfully_joined");
			name = params.name ? params.name : client.id;
			rooms[params.room_id].player_name = name;
			rooms[params.room_id].player = client;
			in_game = true;
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

	client.on('disconnect', function(){
		if (in_game) { //in_game is the room_id if playing (not just a spectator) or "" (which evaluates to false)
			client.to(in_game).emit("a_player_left", name);
		}
	});
};

function getRandomRoomID(){
	return ("0000" + Math.floor(Math.random()*(10000))).slice(-4); //"0000" to "9999"
}

function startGame(room_id){
	rooms[room_id].game = 1;
	rooms[room_id].host_is_mastermind = !!(Math.round(Math.random())); //Evaluates to true or false, randomly. (!! is a hacky way to convert to boolean)
}
