(function () {
	if (window.Toastbread) {
		if (!window.io) {
			var ioinclude;
			(ioinclude=document.createElement('script')).src='http://cdn.socket.io/stable/socket.io.js';
			document.body.appendChild(ioinclude);
		}
	
		var GSMP = {
			mode: 'synch',
			init: function() {
				console.log('Grooveshark Multiplayer loaded');
				Toastbread.onSetVolume(function(volume) {
					console.log("GSMP registed volume change to"+volume);
				});
			}
		}
		
		window.Grooveshark.Multiplayer = GSMP;
		GSMP.init();
	} else {
		console.log("Grooveshark Multiplayer is dependent on Toastbread (Grooveshark Javascript API Extension)");
	}	
})();
