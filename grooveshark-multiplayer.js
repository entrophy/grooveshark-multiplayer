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
				
				this.socket.on('methodSync', function (data) {
					console.log('methodSync');
					console.log(data);
				});
				this.UI.init();
			},
			
			createSession: function () {
				this.socket.emit('createSession', '', function (sessionId) {
					this.sessionId = sessionId;
				});
			},
			joinSession: function(sessionId) {
				this.sessionId = sessionId;
				this.socket.emit('joinSession', {'sessionId': sessionId});
			},
			UI: {
				init: function() {
					var that = this;
					
					setTimeout(function() {
						that.Box.init();
						that.Toolbar.init();
					}, 3000);
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

							html += '<input type="text" id="gsmp-join-session-id" name="" value="" style="'+input+'"/>';
							html += '<div id="gsmp-join-session" style="'+button+'">Join session</div>';
						html += '</div>';
						
						$('#footer').append(html);
					},
					events: function() {
						setTimeout(function() {
							$('#gsmp-join-session').click(function() {
								window.Grooveshark.Multiplayer.joinSession($('#gsmp-join-session-id').val());
								console.log("join session clicked");
							});
						}, 1000);
					}
				},
				Toolbar: {
					init: function() {
						this.build();
						this.events();
					},
					build: function() {
						var html = '';

						html += '<li id="header-gsmp-group" class="btn_group">';
							html += '<button id="header-gsmp-button" class="btn btn_style1 btn_style1_selectbox account dropdownButton" type="button">';
								html += '<div>';
									html += '<span class="label">GSMP</span>';
								html += '</div>';
							html += '</button>';

							html += '<div id="gsmp-dropdown" class="dropdown right" style="position: absolute; top: 21px; right: 0; z-index: 9999; left: auto; min-width: 125%;">';
								html += '<ul class="dropdownOptions" style="padding-top: 5px; -webkit-border-radius: 3px 0px 3px 3px; -moz-border-radius: 3px 0px 3px 3px; border-radius: 3px 0px 3px 3px;">';
									html += '<li class="option">';
										html += '<a id="gsmp-create-session" href="#">';
											html += '<span>Create Session</span>';
										html += '</a>';
									html += '</li>';
									html += '<li class="option">';
										html += '<a href="#">';
											html += '<span>Join Session</span>';
										html += '</a>';
									html += '</li>';
								html += '</ul>';
							html += '</div>';
						html += '</li>';

						$('#userOptions').append(html);
					},
					events: function() {
						setTimeout(function() {
							$('#header-gsmp-button').click(function() {
								$('#gsmp-dropdown').toggle();
							});

							$('#gsmp-create-session').click(function() {
								window.Grooveshark.Multiplayer.createSession();
							});
						}, 1000);
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
