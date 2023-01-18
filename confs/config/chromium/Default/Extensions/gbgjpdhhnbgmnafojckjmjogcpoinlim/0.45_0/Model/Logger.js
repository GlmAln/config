var Logger = new function(){
    var self = this;
    self._listeners = [];
    self._logs = [];
    self._uploadinglogs = false;

    self.init = function(){
        window.onerror = Logger.error;
    };

    self.onError = function(listener){
        if(self._listeners.indexOf(listener) == -1)
            self._listeners.push(listener);
    };

    self.log = function(msg){
        var tsmsg = new Date().getTime().toString() + ":"+ msg;
        // console.log(tsmsg);
        self._logs.push(tsmsg);
    };

    //Handle an uncaught exception
    self.error = function(msg, file, line, col, error){
        //Log locally first
        self.log(msg);

        //Send error message alone to server first
        self._logToServer({error: msg}, function(success){
            if(success){
                //Collect stack trace if this is an exception
                if(error) {
                    self._logStackTrace(error, function (success) {
                        if(success)
                            self._sendLogsToServer(self._notifyError);
                        else
                            self._notifyError();
                    });
                }
            }
            else
                self._notifyError();
        });
    };

    //Report an error condition (whoops)
    self.report = function(){
        //Send the last log message as error
        var msg = (self._logs.length > 0) ? self._logs[self._logs.length-1]:"whoops";
        self._logToServer({error: msg}, function(success){
            if(success) {
                self._sendLogsToServer();
            }
        });
    };

    self._logStackTrace = function(error, callback){
        StackTrace.fromError(error, {offline: true}).then(function (stackframes) {
            //Log stack locally
            // console.log(JSON.stringify(stackframes));
            //Send stack trace to server
            self._compresslogToServer("stack", JSON.stringify(stackframes), callback);

        }).catch(function () {
            callback(true);
        });
    };

    self._sendLogsToServer = function(callback){
        //Avoid re-entrancy
        if(self._uploadinglogs){
            if(callback)
                callback();
            return;
        }

        if(self._logs && self._logs.length > 0) {
            self._uploadinglogs = true;
            //Send complete diagnostic log to server
            self._compresslogToServer("logs", JSON.stringify(self._logs), function (success) {
                self._uploadinglogs = false;
                if (success) {
                    //Clear logs if we have sent it to server
                    self._logs = [];
                }
                if(callback)
                    callback();
            });
        }
        else if(callback)
            callback();
    };

    self._compresslogToServer = function(name, log, callback){
        if ('TextEncoder' in window) {
            // Chrome version>= 38
            var encoder = new TextEncoder("utf-8");
            var encodeddata = encoder.encode(log);
            if(encodeddata.byteLength > 0){
                var unitarray = new Uint8Array(encodeddata);
                var compressor = new Zlib.Deflate(unitarray);
                var dump = compressor.compress();
                var uploaddata = {};
                uploaddata[name] = StringView.bytesToBase64(dump);
                self._logToServer(uploaddata, function(result){
                    callback(result);
                });
            }
            else{
                callback(true);
            }
        }
        else
            callback(false);
    };

    self._readlogFromServer = function(uploadedlog, callback){
        if ('TextDecoder' in window) {
            // Chrome version>= 38
            if(uploadedlog.length > 0){
                var jsonlog = JSON.parse(uploadedlog.substring(uploadedlog.indexOf('{'), uploadedlog.indexOf('}')+1));
                var base64log = jsonlog[Object.keys(jsonlog)[0]].replace(/\\r\\n/g,'↵');
                var dump = StringView.base64ToBytes(base64log);
                var decompressor = new Zlib.Inflate(dump);
                var uintarray = decompressor.decompress();
                var decoder = new TextDecoder("utf-8");
                var decodedlogs = decoder.decode(uintarray);
                callback(_lookdeep(JSON.parse(decodedlogs)));
            }
            else{
                callback(null);
            }
        }
        else
            callback(null);
    };

    self._logToServer = function(msg, callback){

        $.post(ERROR_LOG_URL, {logs:[JSON.stringify(msg)]})
            .done(function(){
                //Now that we have logged to server, notify locally
                callback(true);
            })
            .fail(function(){
                self.log("Failed to send error logs");
                callback(false);
        });

    };

    self._notifyError = function(){
        self._listeners.forEach(function(listener){
            listener();
        });
    };

    _lookdeep = function(obj){
        var A= [], tem;
        for(var p in obj){
            if(obj.hasOwnProperty(p)){
                tem= obj[p];
                if(tem){
                    if(typeof tem=='object'){
                        A[A.length]= p+':{ '+arguments.callee(tem).join(', ')+'}';
                    }
                    else
                        A[A.length]= [p+':'+tem.toString()];
                }
            }
        }
        return A;
    };
};
