require.paths.unshift('/usr/local/lib/node_modules');

var app = require('express').createServer(), io = require('socket.io').listen(app);

app.listen(8080);

var gsmp = io.of('/gsmp').on('connection', function(client) {
	console.log("connection");

	client.on('method', function(data) {
		console.log(data);
	});
});
