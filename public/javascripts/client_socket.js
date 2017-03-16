var socket = io();

function createGame(){
	var name = "Player 1"; //Somehow want to give the player a way to set their name.
	socket.emit('create_game', name);
	socket.on('game_created', function(room_id){
		//Will probably want to give them some kind of message that says something like this
		//Maybe put some text in a div or span?
		console.log("Game successfully created. Your room ID is:", room_id);

	});
}

function joinGame(){
	var parameters = {
		room_id: "0001",	//Will also want to give the player a way to set these
		name: "Player 2"
	};
	socket.emit('join_game', parameters);
	socket.on('successfully_joined', function(){
		console.log("Game successfully joined.");
	});
	socket.on("failed_to_join", function(){
		console.log("Unable to join game.");
	});
}
