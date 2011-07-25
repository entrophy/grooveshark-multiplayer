(function () {
	if (window.Toastbread) {
		var GSMP = {
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
