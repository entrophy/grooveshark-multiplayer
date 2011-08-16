//require.paths.unshift('/usr/local/lib/node_modules');
require.paths.unshift('/home/ubuntu/npm/node_modules'); // for server

var app = require('express').createServer(), io = require('socket.io').listen(app);

//app.listen(8080);
app.listen(8124); // for server

var sessions = {};
var sessionClients = function (sessionId, client, deviceType) {
	var clients = sessions[sessionId]['clients'];
	var _clients = [];
	for (var x in clients) {
		var _client = clients[x];
		
		if (_client.id != client.id) {
			if (deviceType) {
				if (_client.deviceType == deviceType) {
					_clients.push(_client);
				}
			} else {
				_clients.push(_client);
			}
		}
	}
	
	return _clients;
}

var gsmp = io.of('/gsmp').on('connection', function(client) {
	if (!client.gsmp) {
		client.gsmp = {};
	}

	client.on('method', function(data) {
		if (client.gsmp.sessionId) {
			var clients = sessionClients(client.gsmp.sessionId, client);
			if (clients.length) {
				for (var x in clients) {
					gsmp.socket(clients[x].id).emit('methodSync', data);
				}
			}
		}
	});
	
	client.on('createSession', function(data, callback) {
		var sessionId = 'AD123-aAfx5-123asd';
		client.gsmp.sessionId = sessionId;
		client.deviceType = data.deviceType;
		
		sessions[sessionId] = { 'clients': [client], 'state': {} };

		callback(sessionId, client.id);
	});
	
	client.on('joinSession', function(data, callback) {
		var sessionId = data.sessionId;
		
		client.gsmp.sessionId = sessionId;
		client.deviceType = data.deviceType;

		console.log(client.deviceType);
		
		sessions[sessionId]['clients'].push(client);

		// find existing web client to synchronize new client with
		var clients = sessionClients(client.gsmp.sessionId, client, 'web');
		if (clients.length) {
			var sender;
			for (var x in clients) {
				sender = clients[x]; break;
			}
			
			gsmp.socket(sender.id).emit('sessionStateCrawl', client.id);
		}

		callback(sessionId, client.id);
	});

	client.on('crawlSession', function(data) {
		console.log(data.data);
		gsmp.socket(data.receiverId).emit('sessionStateSync', data.data);
	});
	
	client.on('leaveSession', function() {
	
	});
	
	client.on('killSession', function() {
		delete sessions[client.gsmp.sessionId];
	});
});
