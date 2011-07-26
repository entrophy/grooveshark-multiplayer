(function () {
	if (window.Toastbread) {
		var GSMP = {
			mode: 'sync',
			socket: Object,
			init: function() {
				console.log('Grooveshark Multiplayer loaded');

				console.log(window);
				
				GSMP.socket = new io.connect('http://192.168.1.16:8080/gsmp');

				Toastbread.onSetVolume(function(volume) {
					console.log("GSMP registed volume change to"+volume);

					GSMP.socket.emit('method', { 'volume': volume });
				});
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
