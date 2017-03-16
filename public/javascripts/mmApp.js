angular.module('mmApp', []).controller('mmCtrl', function($scope) {

    var socket = io();

    $scope.gamerows = null;
    $scope.markrows = null;
    $scope.disableNewGameBtn = false;
    $scope.disableJoinGameBtn = false;
    $scope.disableGuessSubmitBtn = true;
    $scope.showColorCodeBox = false;
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
                    {id: 4, value: "GREEN"}
                 ],
                response: "SSC "
            },
            {
                guess: [
                    {id: 1, value: "RED"},
                    {id: 2, value: "YELLOW"},
                    {id: 3, value: "RED"},
                    {id: 4, value: "GREEN"}
                 ],
                response: "SSS "
            },
            {
                guess: [
                    {id: 1, value: "RED"},
                    {id: 2, value: "YELLOW"},
                    {id: 3, value: "RED"},
                    {id: 4, value: "PURPLE"}
                 ],
                response: "SSS "
            }
        ]
    };

    $scope.createGame = function() {
        socket.emit('create_game', $scope.userName);
        $scope.message="Creating new game now...";
    };

    $scope.submitColorCode = function() {
        socket.emit('set_code', $scope.colorCode.code);
        console.log("Set code to: " + $scope.colorCode.code);
    };

	$scope.submitGuess = function(){
	    socket.emit('make_guess', $scope.guess.guess);
		console.log("Guess: " + $scope.guess.guess);
        //Response will be handled down below on "board_updated"
	};

    $scope.createGame = function() {
        socket.emit('create_game', $scope.userName);
    };

    $scope.joinGame = function() {
        var parameters = {
            room_id: $scope.roomId,
            name: $scope.userName
        };
        socket.emit('join_game', parameters);
    };

    $scope.submitGuess = function(){
  	    socket.emit('make_guess', $scope.guess.guess);
  		console.log("Guess: " + $scope.guess.guess);
  	};

	socket.on('game_created', function(room_id){
	    console.log("Game successfully created. Your join code is: "+room_id);
      $scope.$apply(function() {
        $scope.roomId = room_id;
        $scope.message="Game successfully created. Your join code is: " + room_id;
        //DISABLE CREATE/JOIN GAME BUTTONS
        $scope.disableNewGameBtn = true;
        $scope.disableJoinGameBtn = true;
      });
	});

	socket.on('successfully_joined', function(){
	   console.log("Successfully joined game "+$scope.roomId);
     $scope.$apply(function() {
       $scope.message="Game successfully joined.";

      //DISABLE CREATE/JOIN GAME BUTTONS
       $scope.disableNewGameBtn = true;
       $scope.disableJoinGameBtn = true;
     });
	});

	socket.on("failed_to_join", function(){
	    console.log("Failed to join game "+$scope.roomId);
      $scope.$apply (function() {
        $scope.message="Unable to join game.";
      });
	});

	socket.on("you_should_set_code", function(){
	    console.log("You're the mastermind!");
      $scope.$apply (function() {
        $scope.message="You've been selected as the mastermind! Please submit the color code!";
        //ENABLE SUBMIT COLOR CODE BUTTON
        $scope.showColorCodeBox = true;
      });
	});

	socket.on("other_player_is_setting_code", function(){
	    console.log("The other player is the mastermind!");
      $scope.$apply (function() {
        $scope.message="The other player was selected as the mastermind! Please wait while they submit the color code!";
      });
	});

	socket.on("code_set", function(){
	    console.log("Successfully set the color code. Now it's time for the other player to guess it.");
      $scope.$apply (function() {
        $scope.message="Successfully set the color code. Now it's time for player 2 to guess it.";
        //DISABLE SUBMIT COLOR CODE BUTTON
        $scope.showColorCodeBox = false;
      });
    });

    socket.on("code_was_set", function(){
        console.log("The other player set the code. Now it's time for you to break it!");
        $scope.$apply(function() {
          $scope.message="The other player set the code. Now it's time for you to break it!";
          //ENABLE SUBMIT GUESS BUTTON
          $scope.disableGuessSubmitBtn = false;
        });
    });

    socket.on("board_updated", function(board_state){
        console.log("Board now looks like this:", JSON.stringify(board_state));
        $scope.$apply(function(board_state) {
          //UPDATE APPEARANCE OF BOARD BASED ON board_state
          $scope.sampleResponse=JSON.stringify(board_state);
        });
    });

    socket.on("code_was_guessed", function(){
        console.log("The code was guessed!");
        $scope.$apply(function() {
          $scope.message="The code was guessed!";
          //GAME OVER? ENABLE/DISABLE STUFF?
        });
        $scope.message="The code was guessed!";

        //GAME OVER. ENABLE/DISABLE STUFF?
    });

	socket.on("code_not_guessed", function(){
		console.log("The code was not guessed!");
    $scope.$apply(function() {
      $scope.message="The code was not guessed!";
  		//GAME OVER!
    });
	});

    socket.on("a_player_left", function(){
        console.log("The other player left.");
        $scope.$apply(function() {
          $scope.message="The other player left!";
          //GAME OVER
        });
    });
});
