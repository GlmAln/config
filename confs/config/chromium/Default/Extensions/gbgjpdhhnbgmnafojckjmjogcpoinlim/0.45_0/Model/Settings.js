var Settings = new function(){
    var self = this;
    self._feedpollrate = 120;
    self._auto_pop_cooldown = 0;
    self._locale = 'en_US';
    self._experiments = {};

    self._listeners = [];
    self.state = STATE_UNKNOWN;
    self.error_code = ERROR_CODE.SUCCESS;

    self.init = function(){
        self._feedpollrate = 120;
        self._auto_pop_cooldown = 0;
        self._locale = 'en_US';

        Session.onStateChange(self.onSessionChanged);

        if(Session.state == STATE_LOADED)
            self._loadSettings();
    };

    self.onStateChange = function(listener){
        if(self._listeners.indexOf(listener) == -1)
            self._listeners.push(listener);
    };

    self._notifyStateChange = function(stateChange){
        self._listeners.forEach(function(listener){
            listener(stateChange);
        });
    };

    self.getFeedPollRate = function(){
        return self._feedpollrate;
    };

    self.getAutoPopCooldown = function(){
        return self._auto_pop_cooldown;
    };

    self.getLocale = function(){
      return self._locale;
    };

    self._loadSettings = function(){
        self.state = STATE_LOADING;
        self.error_code = ERROR_CODE.SUCCESS;
        self._notifyStateChange();

        self._fetchSettings();
    };

    self.onSessionChanged = function(){
        if(Session.state == STATE_LOADED){
            self._loadSettings();
        }
        else if ( Session.state == STATE_ERROR ){
            self.state = STATE_ERROR;
            self.error_code = Session.error_code;
            self._notifyStateChange();
        } else if (Session.state == STATE_UNKNOWN){
            //Added to handle logout scenario
            self.state = STATE_UNKNOWN;
            self._notifyStateChange();
        }
    };

    self._fetchSettings = function(){
        API.gameAjax("extension/special_extension.php",{experiments: [EXPERIMENT.DISABLE_EXTENSION_EXPERIMENT, EXPERIMENT.AUTO_POP_BUDDY_EXPERIMENT]}, function(result){
            if (result.error){
                if (self.state == STATE_LOADING) {
                    self.state = STATE_ERROR;
                    self.error_code = ERROR_CODE.SETTINGS_FETCH_ERROR;
                    self._notifyStateChange();
                }
                else {
                    Logger.log("Unable to fetch settings: " + result.error );
                }
            }
            else
            {
                self._feedpollrate = result.feed_poll_rate;
                if(result.notifInterval && !isNaN(result.notifInterval)) {
                    LocalStorage.set({"notifInterval":result.notifInterval});
                    FV2Notification.updateNotifInterval(result.notifInterval);
                }

                if(result.notifInterval) {
                    LocalStorage.set({"playerId":result.player_id});
					FV2Notification.updatePlayerId(result.player_id);
                }
                if (result.auto_pop_cooldown){
                    self._auto_pop_cooldown = result.auto_pop_cooldown;
                }
                self._locale = result.locale;
                if (result.experiment_variant_data){
                    self._experiments = result.experiment_variant_data;
                }
                // if (self._experiments[EXPERIMENT.DISABLE_EXTENSION_EXPERIMENT] == 2 || result.using_extension == 1){
                    self.state = STATE_LOADED;
                    self.error_code = ERROR_CODE.SUCCESS;
                // }
                // else{
                //     self.error_code = ERROR_CODE.EXTENSION_DISABLED;// 1 for not able to load session
                //     StatsManager.count("xpress", "experiment_disabled");
                //     self.state = STATE_ERROR;
                //     Logger.log("Extension disabled. zid:" + API.getCurrentUserID());
                // }
                self._notifyStateChange();
            }
            //Keep polling even on failure
            setTimeout(self._fetchSettings, SETTINGS_FETCH_INTERVAL);
        });
    };
};
