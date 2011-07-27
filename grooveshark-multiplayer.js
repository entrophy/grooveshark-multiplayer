(function () {
	if (window.Toastbread) {
		var GSMP = {
			mode: 'sync',
			socket: Object,
			sessionId: '',
			init: function() {
				var that = this;
				console.log('Grooveshark Multiplayer loaded');

				this.socket = io.connect('http://192.168.1.10:8080/gsmp');

				var methodSync = [
					"setVolume", 
					"setShuffle", 
					"setRepeat",
					"setIsMuted",
					"next",
					"previous",
					
					"Queue_addSongs",
					"Queue_clear"
				];

				_.forEach(methodSync, function (method) {
					(function (method) {	
						Toastbread.addEventListener(method, function () {
							var args = Array.prototype.slice.call(arguments);
							var namespace = '';
							var methodName = method;
						
							if (method.search('_') != -1) {
								methodName = method.split('_');
								namespace = methodName[0];
								methodName = methodName[1];
							}
						
							that.socket.emit('method', {'namespace': namespace, 'name': methodName, 'arguments': args});
						});
					})(method);
				});

				this.socket.on('methodSync', function (data) {
					console.log(data);
					if (data.namespace && data.namespace != '') {
						Toastbread[data.namespace][data.name].apply(Toastbread[data.namespace], data.arguments);
					} else {
						Toastbread[data.name].apply(Toastbread, data.arguments);
					}
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
						that.Toolbar.init();
					}, 2000);
				},
				Toolbar: {
					init: function() {
						this.build();
						this.events();
					},
					build: function() {
						var html = '';

						html += '<li id="gsmp-header" class="loginOption">';
							html += '<a id="gsmp-header-button" class="btn btn_style1 btn_style1_selectbox login">';
								html += '<div><span class="label">Multiplayer</span></div>';
							html += '</a>';

							html += '<div id="gsmp-dropdown-box" class="hide" style="position: absolute; top: 20px; width: 340px; z-index: 4500; right: 0;">';
								html += '<div id="gsmp-dropdown-border" style="border: 1px solid rgba(0, 0, 0, .25); -webkit-border-radius: 2px 0px 2px 2px; -moz-border-radius: 2px 0px 2px 2px; border-radius: 2px 0px 2px 2px;">';
									html += '<div id="gsmp-dropdown-wrapper" style="display: block; margin: 0; padding: 8px; background-color: #fff; -webkit-border-radius: 2px 0px 2px 2px; -moz-border-radius: 2px 0px 2px 2px; border-radius: 2px 0px 2px 2px;">';

										html += '<div id="gsmp-dropdown-inner" style="display: block; margin: 0; padding: 10px; background-color: #f5f5f5; border: 1px solid #d9d9d9; width: auto;">';
											html += '<ul>';
												html += '<li style="float: none; margin: 0; padding: 0px 0px 13px 0px;">';
													html += '<label for="gsmp-join-session-id" style="display: block; padding: 0px 0px 8px 0px; font-size: 12px; height: 12px; line-height: 1; color: #666;">Session ID</label>';
													html += '<div class="input_wrapper">';
														html += '<div class="cap">';
															html += '<input type="text" id="gsmp-join-session-id" name="gsmp-join-session-id" value="" />';
														html += '</div>';
													html += '</div>';
													html += '<div class="clear"></div>';
												html += '</li>';
												html += '<li style="float: none; margin: 0; padding: 0px 0px 13px 0px;">';
													html += '<button id="gsmp-create-session" class="btn btn_style4">';
														html += '<div>';
															html += '<span>Create Session</span>';
														html += '</div>';
													html += '</button>';

													html += '<button id="gsmp-join-session" class="btn btn_style4" style="float: right;">';
														html += '<div>';
															html += '<span>Join Session</span>';
														html += '</div>';
													html += '</button>';
													html += '<div class="clear"></div>';
												html += '</li>';
											html += '</ul>';
										html += '</div>';

										html += '<div id="gsmp-dropdown-links" style="display: block; margin: 0; border: 1px solid #d9d9d9; border-top: 0; background-color: #ebebeb;">';
											html += '<ul style="padding: 8px 10px;">';
												html += '<li style="display: inline; float: none; background: url(\'http://static.a.gs-cdn.net/webincludes/css/images/bullet_seperator.png\') no-repeat right 6px; margin: 0px 6px 0px 0px; padding: 0px 12px 0px 0px;"><a href="#" style="font-size: 11px;">Grooveshark Multiplayer</a></li>';
												html += '<li style="display: inline; float: none; background: none; margin: 0; padding: 0;"><a href="#" style="font-size: 11px;">Be Right Back, Its Uploading</a></li>';
											html += '</ul>';
											html += '<div class="clear"></div>';
										html += '</div>';
									html += '</div>';
								html += '</div>';
							html += '</div>';
						html += '</li>';

						$('#userOptions').append(html);
					},
					events: function() {
						setTimeout(function() {
							$('html').click(function() {
								$('#gsmp-dropdown-box').hide();
								$('#gsmp-header-button').removeClass('active');
							});

							$('#gsmp-dropdown-box, #gsmp-header-button').click(function(e) {
								$('#dropdown_loginForm_box, #userSelectOptions').hide();
								$('#header_login, #header_account_button').removeClass('active');

								
								e.stopPropagation();
							});
							
							$('#gsmp-header-button').click(function() {
								var dropdown = $('#gsmp-dropdown-box');
								if (dropdown.css('display') === 'block') {
									dropdown.hide();
									$(this).removeClass('active'); 
								} else {
									dropdown.show();
									$(this).addClass('active');
								}
							});

							$('#gsmp-create-session').click(function() {
								window.Grooveshark.Multiplayer.createSession();
								console.log("gsmp-create-session");
							});

							$('#gsmp-join-session').click(function() {
								window.Grooveshark.Multiplayer.joinSession($('#gsmp-join-session-id').val());
								console.log("gsmp-join-session: "+$('#gsmp-join-session-id').val());
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
