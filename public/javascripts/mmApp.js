angular.module('mmApp', []);

angular.module('mmApp').controller('mmCtrl', function($scope) {

    var socket = io();

    $scope.gamerows = null;
    $scope.markrows = null;
    $scope.showColorCodeBox = true;
    $scope.userName ="";
    $scope.roomId="";
    $scope.message="Welcome! Please enter a username and select Create New Game, or if you have a join code, enter a user name and the code and select Join Existing Game.";

    $scope.colors = [
        {id: "RED", value: "red"},
        {id: "GREEN", value: "green"},
        {id: "YELLOW", value: "yellow"},
        {id: "PURPLE", value: "purple"}
    ];

    $scope.guess = {guess: ['','','','']};
    $scope.colorCode = {code: ['','','','']};

    $scope.sampleResponse = {
        guesses: [
            {
                guess: [
                    {id: 1, value: "RED"},
                    {id: 2, value: "YELLOW"},
                    {id: 3, value: "RED"},
                    {id: 4, value:"GREEN"}
                 ],
                response: "SSC "
            },
            {
                guess: [
                    {id: 1, value: "RED"},
                    {id: 2, value: "YELLOW"},
                    {id: 3, value: "RED"},
                    {id: 4, value:"GREEN"}
                 ],
                response: "SSS "
            },
            {
                guess: [
                    {id: 1, value: "RED"},
                    {id: 2, value: "YELLOW"},
                    {id: 3, value: "RED"},
                    {id: 4, value:"PURPLE"}
                 ],
                response: "SSS "
            }
        ]
    };


    $scope.submitColorCode = function() {
        console.log($scope.colorCode);
    }

	$scope.submitGuess = function(){
		console.log($scope.guess);
        //Need to submit scope.guess to Server
        //And handle response
        //response data will replace scope.sampleresponse

        // Handle winning response......
	}



    var createGame = function() {
        var name = $scope.userName; //Somehow want to give the player a way to set their name.
        socket.emit('create_game', name);
        socket.on('game_created', function(room_id){
            //Will probably want to give them some kind of message that says something like this
            //Maybe put some text in a div or span?
            $scope.message="Game successfully created. Your room ID is: " + room_id + "<br />Please select the color code for your opponent.";
            $scope.showColorCodeBox = true;
        });
    }

    var joinGame = function() {
        var parameters = {
            room_id: $scope.roomId,
            name: $scope.userName
        };
        socket.emit('join_game', parameters);
        socket.on('successfully_joined', function(){
            $scope.message="Game successfully joined.";
        });
        socket.on("failed_to_join", function(){
            $scope.message="Unable to join game.";
        });
    }



});
