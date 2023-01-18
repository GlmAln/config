var Badge = new function(){
    var self = this;
    var _interval = null;
    var _animationText = "";

    self.setText = function(text){
        self._stopAnimation();
        chrome.browserAction.setBadgeText({text:text.toString()});
        chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 255]});
    };

    self.clear = function(){
        chrome.browserAction.setBadgeText({text:""});
        self._stopAnimation();
    };

    self.animate = function(letter){
        self._stopAnimation();
        self._toggleText(letter);
        self._interval = setInterval(function(){
            self._toggleText(letter);
        }, 5000);
    };

    self._toggleText = function(letter) {
        self._animationText = (self._animationText == letter) ? "" : letter;
        chrome.browserAction.setBadgeText({text: self._animationText.toString()});
        chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
    };

    self._stopAnimation = function(){
        if(self._interval){
            clearInterval(self._interval);
            self._interval = null;
        }
    };
};