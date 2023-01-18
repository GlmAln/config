var API = new function() {
    var self = this;
    self._session = null;
    self._zid = null;
    self._requestCounter = 0;
    self.currentLoadFeedsRetry = 0;
    self.loadFeedsMaxRetry = 5;

    self.init = function (session, callback) {
        self._session = session;
        self._updateZid(session, callback);
    };

    self._updateZid = function (session, callback) {
        self.getZidsFromFBids([session.user_id], function (response) {
            if (response.result == 'success' && response.data.length) {
                var zids = response.data;
                var zid = zids[0];
                Logger.log("Zid: " + zid);
                self._zid = zid;
                self._session = session;
                callback({success: true});
            }
            else {
                callback({error: "Failed to retrieve user ZID"});
            }
        });
    };

    self.getCurrentUserID = function () {
        return self._zid;
    };

    self.getSession = function () {
        return self._session;
    };

    self.setSession = function (session) {
        self._session = session;
    };

    self.clearSession = function () {
        self._session = null;
    };

    self.getZidsFromFBids = function (fbids, callback) {
        self._send('zids.map', {"fromNetwork": "1" + "", "uids": fbids}, function (response) {
                if (response.result == 'failure') {
                    Logger.log("Failed to map FBIDs to ZIDs.Length: "+ fbids.length +" Error:" + response.msg);
                    callback(response);
                }
                else {
                    var data = response.data;
                    var zids = [];
                    for (var i in fbids) {
                        if (fbids.hasOwnProperty(i) && data.hasOwnProperty(fbids[i])) {
                            var fbZid = data[fbids[i]]["18"];
                            zids.push(fbZid);
                        }
                    }
                    response.data = zids;
                    callback(response);
                }
        });
    };

    self.getFeeds = function (sourceZids, starttime, endtime, count, callback) {
        self._loadFeeds(sourceZids, starttime, endtime, count, callback, true);
    };

    self._loadFeeds = function (sourceZids, starttime, endtime, count, callback, primeFeeds) {
        if(primeFeeds == true) {
			self.currentLoadFeedsRetry = 0;
        }
        var method = primeFeeds ? "stream.getOrRequest" : "stream.getRequested";
        self._send(method, {
                'startTime': starttime,
                'endTime': endtime,
                'games': [APP_ID.toString()],
                'sourceZids': sourceZids,
                'limit': count,
                'types': [ZY.Constants.FEED_TYPES.GAME_FEED]
            },
            function (response) {
                if (response.result == "failure") {
                    if (response.msg.toLowerCase().indexOf("timeout") != -1 ) {
                        //Special case when Stream times-out while waiting for zFeeds
                        //Ignore this and retry after sometime
                        if (self.currentLoadFeedsRetry == self.loadFeedsMaxRetry) {
                            //If get requested has failed for loadFeedsMaxRetry no of times then call getorRequest
							setTimeout(function () {
								self._loadFeeds(sourceZids, starttime, endtime, count, callback, true);
							}, FEED_FETCH_WAIT);
                        }
                        else {
							setTimeout(function () {
								self._loadFeeds(sourceZids, starttime, endtime, count, callback, primeFeeds);
							}, FEED_FETCH_WAIT);
                        }
						self.currentLoadFeedsRetry++;
                    }
                    else {
                        Logger.log("Feed call " + method + " failed:" + response.msg);
                        callback(response);
                    }
                }
                else if (primeFeeds && Array.isArray(response.data) && response.data.length && !_isFeed(response.data[0])) {
                    //Feeds are there and getting cached, call again
                    setTimeout(function () {
                        self._loadFeeds(sourceZids, starttime, endtime, count, callback, false);
                    }, FEED_FETCH_WAIT);
                }
                else {
                    callback(response);
                }
            });
    };

    self.gameAjax = function (handler, data, callback, postdata) {
        var getdata = $.extend(true, {}, self._session, data);

        var request = {
            dataType: "json",
            url: GAME_URL + "/" + handler
        };

        if (postdata) {
            request.type = 'POST';
            request.url += "?" + $.param(getdata);
            request.data = postdata;
        }
        else {
            request.data = getdata;
        }

        $.ajax(request).done(function (response) {
            callback(response);
        }).fail(function (xhr, status, error) {
            Logger.log("Game Ajax Failed with Result: " + status + " " + error + " for handler:" + handler);
            callback({error: status});
        });
    };

    self.gameAjaxSkipAuth =  function (handler, data, callback, postdata) {

        var request = {
            dataType: "json",
            url: GAME_URL + "/" + handler
        };

        if (postdata) {
            request.type = 'POST';
            request.url += "?" + $.param(data);
            request.data = postdata;
        }
        else {
            request.data = data;
        }

        $.ajax(request).done(function (response) {
            callback(response);
        }).fail(function (xhr, status, error) {
            Logger.log("Game Ajax Failed with Result: " + status + " " + error + " for handler:" + handler);
            callback({error: status});
        });
    };


    self.loadCompressedData = function (url, callback) {
        var oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
        oReq.responseType = "arraybuffer";

        oReq.onreadystatechange = function () {
            if (oReq.readyState != XMLHttpRequest.DONE) {
                return;
            }
            if (oReq.status == 200 && oReq.response) {
                var byteArray = new Uint8Array(oReq.response);
                var inflate = new Zlib.Inflate(byteArray);
                var plain = inflate.decompress();
                if ('TextDecoder' in window) {
                    // The TextDecoder interface is documented at http://encoding.spec.whatwg.org/#interface-textdecoder
                    var decoder = new TextDecoder("utf-8");
                    var decodedString = decoder.decode(plain);
                    callback(decodedString);
                }
            }
            else {
                callback({error: "Failed:" + oReq.statusText});
            }
        };

        oReq.onerror = oReq.onabort = function () {
            callback({error: "Failed:" + oReq.statusText});
        };

        oReq.send(null);
    };

    _concatUnique = function (list1, list2) {
        var finallist = list1;
        var list1String = list1.join(',') + ',';
        for (var i = 0; i < list2.length; i++) {
            if (list1String.indexOf(list2[i] + ',') === -1) {
                finallist.push(list2[i]);
            }
        }
        return finallist;
    };

    _isFeed = function (feed) {
        return feed && feed.hasOwnProperty('id');
    };

    self._send = function (method, payload, callback) {
        self._requestCounter++;
        var restParam = {
            'a': method,
            'al': JSON.stringify(payload),
            'id': self._requestCounter,
            'ai': APP_ID.toString(),
            'sn': "1"
        };
        var _restServer = "https://api.zynga.com/";
        var _reqPayload = 'v=1.1';

        if (self._session) {
            restParam.us = JSON.stringify(self._session);
        }
        _reqPayload += '&p=' + JSON.stringify(restParam);

        $.ajax({
            url: _restServer,
            type: "POST",
            datatype: "json",
            data: _reqPayload
        }).done(function (response) {
            callback(response);
        }).fail(function (status, statusText) {  // HTTP Fail Handler - TODO: Retry here.
            callback({'result':'failure',
                      'msg':statusText});
        });
    };
};
