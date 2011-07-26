require.paths.unshift('/usr/local/lib/node_modules');

var app = require('express').createServer(), io = require('socket.io').listen(app);

app.listen(8080);

var sessions = {};
var sessionClients = function (client) {
	var session = sessions[client.gsmp.sessionId];
	var _clients = [];
	for (x in session) {
		var _client = session[x];
		
		if (_client.id != client.id) {
			_clients.push(_client);
		}
	}
	
	return _clients;
}

var gsmp = io.of('/gsmp').on('connection', function(client) {
	if (!client.gsmp) {
		client.gsmp = {};
	}

	client.on('method', function(data) {
		console.log(data);
		
		var synch = sessionClients(client);
		if (synch.length) {
			for (x in synch) {
				synch[x].emit('method', data);
			}
		}
	});
	
	client.on('createSession', function(empty, callback) {
		var sessionId = 'AD123-aAfx5-123asd';
		client.gsmp.sessionId = sessionId;
		
		sessions[sessionId] = [client];
		
		callback(sessionId);
	});
	
	client.on('joinSession', function(sessionId) {
		client.gsmp.sessionId = sessionId;
		sessions[sessionId].push(client);
	});
	
	client.on('killSession', function() {
		delete sessions[client.gsmp.sessionId];
	});
});
