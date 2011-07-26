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
			},
			UI: {
				init: function() {
					this.Box.init();
					this.Toolbar.init();
				},
				Box: {
					init: function() {
						this.build();
						this.events();
					},
					build: function() {
						var html = '', 
						button = 'background-color: #aaa; border: 1px solid #333; padding: 5px 10px; cursor: pointer; margin: 0px 0px 10px 0px;',
						input = 'padding: 5px 10px; border: 1px solid #333; margin: 0px 0px 10px 0px;';

						html += '<div style="position: absolute; width: 280px; height: 130px; top: -150px; right: 0; padding: 10px; background-color: #eee; border: 1px solid #aaa; color: #000;">';
							html += '<strong>Grooveshark Multiplayer</strong><br /><br />';

							html += '<div id="gsmp-create-session" style="'+button+'">Create session</div>';
							html += '<input type="text" id="" name="" value="" style="'+input+'"/>';
							html += '<div style="'+button+'">Join session</div>';
						html += '</div>';
						
						$('#footer').append(html);
					},
					events: function() {
						setTimeout(function() {
							$('#gsmp-create-session').click(function() {
								window.Grooveshark.Multiplayer.createSession();
								console.log("create session clicked");
							});
						}, 1000);
					}
				},
				Toolbar: {
					init: function() {
						this.build();
					},
					build: function() {
						var html = '';

						html += '<li class="last">';
							html += '<div class="btn btn_style1">';
								html += '<a href="#" id="gsmp-box-toggle">';
									
								html += '</a>';
							html += '</div>';
						html += '</li>';

						

						$('#userOptions').append(html);
					}
				}
			}
		}

		setTimeout(function() {
			window.Grooveshark.Multiplayer = GSMP;
			GSMP.init();
		}, 1000);
	} else {
		console.log("Grooveshark Multiplayer is dependent on Toastbread (Grooveshark Javascript API Extension)");
	}	
})();
