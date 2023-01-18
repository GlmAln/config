var LocalStorage = new function(){
    var self = this;

    self.get = function(keys, callback){
        chrome.storage.local.get(keys, callback);
    };

    self.set = function(items, callback){
        chrome.storage.local.set(items, callback);
    };

    self.clear = function(){
        chrome.storage.local.clear();
    }

    self.remove = function(items, callback){
        chrome.storage.local.remove(items, callback);
    }
};