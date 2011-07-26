require.paths.unshift('/usr/local/lib/node_modules');

var server = require('express').createServer(), socket = require('socket.io').listen(server);

server.listen(8080);

socket.on('connection', function(client) {
	console.log("connection");

	client.on('method', function(data) {
		console.log(data);
	});
});
