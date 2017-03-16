angular.module('mmApp', []);

angular.module('mmApp').controller('mmCtrl', function($scope) {
	$scope.rows = [
		{spot1: '', spot2: '', spot3: '', spot4: ''},
		{spot1: '', spot2: '', spot3: '', spot4: ''},
		{spot1: '', spot2: '', spot3: '', spot4: ''},
		{spot1: '', spot2: '', spot3: '', spot4: ''},
		{spot1: '', spot2: '', spot3: '', spot4: ''},
		{spot1: '', spot2: '', spot3: '', spot4: ''},
		{spot1: '', spot2: '', spot3: '', spot4: ''},
		{spot1: '', spot2: '', spot3: '', spot4: ''},
		{spot1: '', spot2: '', spot3: '', spot4: ''},
		{spot1: '', spot2: '', spot3: '', spot4: ''},
		{spot1: '', spot2: '', spot3: '', spot4: ''},
		{spot1: '', spot2: '', spot3: '', spot4: ''},
	];

	$scope.colors = [
		{id: "red", value: "red"},
		{id: "green", value: "green"},
		{id: "yellow", value: "yellow"},
		{id: "purple", value: "purple"}
	];

	$scope.submitGuess = function(){
		console.log($scope.rows);
	}
});