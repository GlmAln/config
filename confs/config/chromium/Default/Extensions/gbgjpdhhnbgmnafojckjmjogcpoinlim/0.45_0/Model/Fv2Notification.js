var FV2Notification = new function () {

    var self = this;
    self.notifPreFix = 1;
    self._playerId;
    self._notifInterval = 86400000;
    self._lastNotificationTime = 0;
    self._gameOpen = false;
    self.gameTab = 0;
    self.installSkipDone = false;
    self.priorityMotdName = null;

    self.init = function() {
        LocalStorage.get(["lastNotificationTime", "playerId", "notifInterval"], function(data) {
            if(data.hasOwnProperty("lastNotificationTime")) {
                self._lastNotificationTime = data.lastNotificationTime;
            }
            if(data.hasOwnProperty("notifInterval")) {
            	if(data.notifInterval < 36000000) {
					self._notifInterval = 86400000;
				} else {
					self._notifInterval = data.notifInterval;
				}

			}
            if(data.hasOwnProperty("playerId")) {
                self._playerId = data.playerId;
            }
			self.checkNotif();
        });
        chrome.notifications.onButtonClicked.addListener(self.notificationClicked);
        chrome.notifications.onClicked.addListener(self.notificationClicked);
    };

    self.notificationClicked = function() {
        //var newURL = "https://apps.facebook.com/farmville-two?fb_source=cr_xpress_special";
        // focusOrCreateTabWithID(FV2Notification.gameTab, 'cr_xpress_special');
		chrome.windows.getAll({"populate":true}, function(windows) {

			if (FV2Notification.gameTab) {
				chrome.tabs.update(FV2Notification.gameTab, {"selected":true}, function(tab){
					if (!tab) {
						LocalStorage.get(["REDIRECT_TO_FB_KEY"], function(data) {
							var redirectURL = CANVAS_URL + "?fb_source=xpress_notification";
							if( data.hasOwnProperty("REDIRECT_TO_FB_KEY") ) {
								if (data["REDIRECT_TO_FB_KEY"] == false) {
									//Load zdc
									redirectURL = ZDC_CANVAS_URL + "?fb_source=xpress_notification";
								}
							}
							if(self.priorityMotdName) {
								redirectURL =  redirectURL + "&priorityMOTD=" + self.priorityMotdName;
							}
							chrome.tabs.create({"url":redirectURL, "selected":true});
						});
					}
				});

			} else {
				LocalStorage.get(["REDIRECT_TO_FB_KEY"], function(data) {
					var redirectURL = CANVAS_URL + "?fb_source=xpress_notification";
					if( data.hasOwnProperty("REDIRECT_TO_FB_KEY") ) {
						if (data["REDIRECT_TO_FB_KEY"] == false) {
							//Load zdc
							redirectURL = ZDC_CANVAS_URL + "?fb_source=xpress_notification";
						}
					}
					if(self.priorityMotdName) {
						redirectURL =  redirectURL + "&priorityMOTD=" + self.priorityMotdName;
					}
					chrome.tabs.create({"url":redirectURL, "selected":true});
				});
			}
		});
    }

    self.updateNotifInterval = function(interval) {
		self._notifInterval = interval;
		if(self._notifInterval < 36000000) {
			self._notifInterval = 86400000;
		}
	}

    self.updatePlayerId = function(playerId) {
    	self._playerId = playerId;
	}

    self.gameTabCheckPassed = function() {
        try {
            var nextTime = self._notifInterval + 1000;
            // console.log(self._lastNotificationTime);
            if(!self._playerId) {
                Logger._logToServer("playerId not there", function(){});
            }
            if (self._lastNotificationTime == 0 || (self._lastNotificationTime + self._notifInterval <= new Date().getTime() + 15000)) {
				var time = new Date().getTime();
				LocalStorage.set({"lastNotificationTime": time});
				self._lastNotificationTime = time;
                API.gameAjaxSkipAuth("extension/notifications.php", {playerId: self._playerId}, function (result) {
                    if(!result.hasOwnProperty("isDisabled") || result.isDisabled == false) {
                        if (result.status == "success") {
                            if (result.notification && typeof result.notification != Object) {
                                var notifId = new Date().getTime();
                                if(result.priorityDialogName && typeof result.priorityDialogName === 'string') {
                                	self.priorityMotdName = result.priorityDialogName;
								}
                                chrome.notifications.create(notifId.toString(), result.notification, function (id) {
                                    if (Settings.state == STATE_LOADED) {
                                        StatsManager.count("xpress", "extension_notif", "success", "AfterLogin", "", "", id);
                                    } else {
                                        Settings.onStateChange(function () {
                                            if (Settings.state == STATE_LOADED) {
                                                StatsManager.count("xpress", "extension_notif", "success", "beforeLogin", "", "", id);
                                            }
                                        });
                                    }
                                });
                            } else {
                                Logger._logToServer("result.getNotif call failed for" + self._playerId + ":" + JSON.stringify(result), function(){});
                            }
                        } else {
                            Logger._logToServer("getNotif call failed for" + self._playerId, function(){});
                        }
                    }
                });
            } else {
                nextTime = self._lastNotificationTime + self._notifInterval - new Date().getTime() + 1000
            }
        } catch (ex) {
            Logger.error(ex.message, "Fv2Notification.js",0,0,ex);
        }
        setTimeout(function () {
            self.checkNotif();
        }, nextTime);
    }

    self.checkNotif = function() {
        //check active game then skip
		if(firstSession && self.installSkipDone == false) {
			self.installSkipDone = true;
			setTimeout(function () {
				self.checkNotif();
			}, self._notifInterval + 1000);
		} else if(self.gameTab) {
            chrome.tabs.get(self.gameTab, function(tab) {
                if (tab && tab.url) {
                    var tabURL = tab.url
                    if (tabURL.indexOf("apps.facebook.com/farmville-two") > -1) {
                        setTimeout(function () {
                            self.checkNotif();
                        }, self._notifInterval);
                        if (Settings.state == STATE_LOADED) {
                            StatsManager.count("xpress", "extension_notif", "gameOpen", "AfterLogin");
                        } else {
                            Settings.onStateChange(function () {
                                if (Settings.state == STATE_LOADED) {
                                    StatsManager.count("xpress", "extension_notif", "gameOpen", "beforeLogin");
                                }
                            });
                        }
                    } else {
                        self.gameTabCheckPassed();
                    }
                } else {
                    self.gameTabCheckPassed();
                }
            });
        } else {
            self.gameTabCheckPassed();
        }

    };

};