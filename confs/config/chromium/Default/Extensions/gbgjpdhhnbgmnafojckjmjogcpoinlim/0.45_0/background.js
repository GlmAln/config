var g_state = STATE_UNKNOWN;
var g_stream_tab_id = null;//tab which is showing the stream bar
var installed_just_now = false;
var firstSession = false;
var notificationTimer = undefined;

var popupWindow = null;
var notify_clicked = false;

chrome.runtime.onInstalled.addListener(function(details){
    var version = chrome.runtime.getManifest().version;
    if(details.reason == "install"){
        // installed_just_now = true;
		firstSession = true;
        Logger.log("Extension installed " + version);
        StatsManager.milestone("xpress_installed", version + ":"+ navigator.userAgent);
        //Check if apps.facebook.com tab is opened redirect to FB and if zyngagames.com tab is opened set redirect to zdc
		// updateRedirectToInfo();
    }
    else if(details.reason == "update" && version != details.previousVersion){
        Logger.log("Extension updated from " + details.previousVersion + " to " + version);
        StatsManager.milestone("xpress_updated", version + ":"+  navigator.userAgent);
    }
});

chrome.runtime.onUpdateAvailable.addListener(function(details){
    Logger.log("Updating to newer version "+ details.version);
});

$(document).ready(function() {
	var flashResIdentifier;
	chrome.contentSettings.plugins.getResourceIdentifiers(function(resIdentifiers) {
		for (var i=0; i<resIdentifiers.length; i++) {
			if (resIdentifiers[i].id == "adobe-flash-player") {
				flashResIdentifier = resIdentifiers;
				break;
			}
		}
	});
	chrome.contentSettings.plugins.get({'primaryUrl':'https://apps.facebook.com/', 'resourceIdentifier':flashResIdentifier}, function (details) {
		if (details) {
			StatsManager.count("xpress", details.setting);//Added this for figuring out how much % of players are in Blocked by default variant in chrome. Will not get fired until player logs in to extension.
		}
	});
	chrome.contentSettings.plugins.set({'primaryPattern':'https://apps.facebook.com/*', 'resourceIdentifier':flashResIdentifier, 'setting':'allow'});
	chrome.contentSettings.plugins.set({'primaryPattern':'https://zyngagames.com/*', 'resourceIdentifier':flashResIdentifier, 'setting':'allow'});

    Logger.init();

    Logger.log("Version "+chrome.runtime.getManifest().version+" Loaded on "+ navigator.userAgent);
	FV2Notification.init();

    if(chrome.runtime.setUninstallURL) {
        chrome.runtime.setUninstallURL(GAME_URL+'/extension/uninstall_express.php?&version='+ chrome.runtime.getManifest().version);
    }
});


chrome.browserAction.onClicked.addListener(function(tab) {
    // Open the side-bar
    // if (installed_just_now){
    //     var url = chrome.extension.getURL("/install_success.html");
    //     chrome.tabs.create({"url":url, "selected":true});
    //     installed_just_now = false;
    // }
    // else {
		// focusOrCreateTabWithID(FV2Notification.gameTab);
        focusOrCreateTab("fb_source=xpress_icon_click");
    // }
});

chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
        if (request.event == "open"){
            // openStreamBar(sender.tab.id);
            FV2Notification.gameTab = sender.tab.id;
            LocalStorage.set({LAST_TABID_KEY:sender.tab.id});
            StatsManager.count("xpress_open", "game", "click");
            if (request.player_id) {
                LocalStorage.get(["playerId"], function(data) {
                    if(!data.hasOwnProperty("playerId")) {
                        LocalStorage.set({"playerId":request.player_id});
                    }
                });
            }
			if (request.notif_interval) {
				LocalStorage.get(["notifInterval"], function(data) {
					if(!data.hasOwnProperty("notifInterval")) {
						LocalStorage.set({"notifInterval":request.notif_interval});
					}
				});
			}
            if (request.hasOwnProperty('redirectToFB')) {
                LocalStorage.set({"REDIRECT_TO_FB_KEY": request.redirectToFB});
            }
            sendResponse({hasLatestExtension:true});
        }
    });


function focusOrCreateTab(fbsource) {

	if(FV2Notification.gameTab){
		chrome.tabs.update(FV2Notification.gameTab, {"selected":true}, function(tab){
			if (!tab)  {
				LocalStorage.get(["REDIRECT_TO_FB_KEY"], function(data) {
					var redirectURL = CANVAS_URL + "?" + fbsource;
					if( data.hasOwnProperty("REDIRECT_TO_FB_KEY") ) {
						if (data["REDIRECT_TO_FB_KEY"] == false) {
							//Load zdc
							redirectURL = ZDC_CANVAS_URL + "?" + fbsource;
						}
					}
					chrome.tabs.create({"url":redirectURL, "selected":true});
				});
			}
		});
	}
	else {
		LocalStorage.get(["REDIRECT_TO_FB_KEY"], function(data) {
			var redirectURL = CANVAS_URL + "?" + fbsource;
			if( data.hasOwnProperty("REDIRECT_TO_FB_KEY") ) {
				if (data["REDIRECT_TO_FB_KEY"] == false) {
					//Load zdc
					redirectURL = ZDC_CANVAS_URL + "?" + fbsource;
				}
			}
			chrome.tabs.create({"url":redirectURL, "selected":true});
		});
	}

}
