(function () {
	if (window.Toastbread) {
		var GSMP = {
			mode: 'sync',
			socket: Object,
			sessionId: '',
			init: function() {
				var that = this;
				console.log('Grooveshark Multiplayer loaded');

				this.socket = new io.connect('http://192.168.1.16:8080/gsmp');

				var methodSync = ["setVolume", "setShuffle", "setRepeat"];
				_.forEach(methodSync, function (method) {
					Toastbread.addEventListener(method, function () {
						var args = Array.prototype.slice.call(arguments);
						that.socket.emit('method', {'name': method, 'arguments': args});
					});
				});
				
				this.socket.on('method', function (data) {
					console.log(data);
				});
				this.UI.init();
			},
			
			createSession: function () {
				this.socket.emit('createSession', '', function (sessionId) {
					this.sessionId = sessionId;
					console.log(sessionId);
				});
			},
			joinSession: function(sessionId) {
				this.sessionId = sessionId;
				console.log(sessionId);
				this.socket.emit('joinSession', {'sessionId': sessionId});
			}
		}

		setTimeout(function() {
			window.Grooveshark.Multiplayer = GSMP;
			GSMP.init();
		}, 500);
	} else {
		console.log("Grooveshark Multiplayer is dependent on Toastbread (Grooveshark Javascript API Extension)");
	}	
})();
