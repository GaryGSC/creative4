//On connection
module.exports = function(client){
	console.log("A client connected.");
	client.on('event', function(data){});
	client.on('disconnect', function(){});
};