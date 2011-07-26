require.paths.unshift('/usr/local/lib/node_modules');

var app = require('express').createServer(), io = require('socket.io').listen(app);

app.listen(8080);

var sessions = {};
var sessionClients = function (sessionId, clientId) {
	var session = sessions[sessionId];
	var clientsIds = [];
	for (x in session) {
		var _clientId = session[x]; 
		
		if (_clientId != clientId) {
			clientsIds.push(_clientId);
		}
	}
	
	return clientsIds;
}

var gsmp = io.of('/gsmp').on('connection', function(client) {
	if (!client.gsmp) {
		client.gsmp = {};
	}

	client.on('method', function(data) {
		console.log(data);
		
		var synch = sessionClients(client.gsmp.sessionId, client.id);
		if (synch.length) {
			for (x in synch) {
				io.clients[synch[x]].emit('method', data);
			}
		}
	});
	
	client.on('createSession', function(empty, callback) {
		var sessionId = 'AD123-aAfx5-123asd';
		client.gsmp.sessionId = sessionId;
		
		console.log(sessions);
		sessions[sessionId] = [client.id];
		console.log(sessions);
		
		callback(sessionId);
	});
	
	client.on('joinSession', function(data) {
		var sessionId = data.sessionId;
		client.gsmp.sessionId = sessionId;
		sessions[sessionId].push(client.id);
	});
	
	client.on('killSession', function() {
		delete sessions[client.gsmp.sessionId];
	});
});
