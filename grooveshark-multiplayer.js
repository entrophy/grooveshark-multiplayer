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

				this.UI.init();
			},
			UI: {
				init: function() {
					this.Controls.init();
				},
				Controls: {
					init: function() {
						this.build();
					},
					build: function() {
						var html = '', button = 'background-color: #aaa; border: 1px solid #333; float: left; padding: 5px 10px;';

						html += '<div style="position: absolute; width: 280px; height: 130px; top: -150px; right: 0; padding: 10px; background-color: #eee; border: 1px solid #aaa; color: #000;">';
							html += '<strong>Grooveshark Multiplayer</strong><br /><br />';
							html += '<div style="'+button+'">Create session</div><br /><br />';

							
							html += '<div style="'+button+'">Join session</div><br /><br />';
							
						html += '</div>';
						
						$('#footer').append(html);
					}
				}
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
