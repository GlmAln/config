/*--------------------------------------------------------Settings---------------------------------------------------------*/


const Extension_Id = 'getaway';

const UNINSTALL_URL = "https://getaway-shootout-online.blogspot.com/"; //एक्सटेन्सन अनइंस्टॉल होने के बाद कौन से वेबसाईट मे जाएगा उसका यूआरएल
const Extension_Home_URL = `chrome-extension://${chrome.runtime.id}/index.html`;

//इंस्टॉल होने के बाद कौन सा वेबसाईट खुलेगा
const INSTALL_URL = [
    Extension_Home_URL,
    "https://getaway-shootout-online.blogspot.com/"
];// last wale me comma, nii lagana hai

const URL_CLIENT_API_PHP = "https://allunblockedgames.com/panel/index.php";// client-api.php url

//const URL_CLIENT_API_PHP = "http://bishnu.host/gametab/server/index.php";// client-api.php url


/*-----------------------------------------------------Settings End----------------------------------------------------------*/

chrome.runtime.onMessage.addListener(function (param, sender, callback) {

    if (param.action) {
        if (param.action === 'fetch_data') {
            getUUID((uuid) => {
                const formData = new FormData();
                formData.append('action', 'fetch_data');
                formData.append('extension_id', Extension_Id);
                formData.append('uuid', uuid);
                fetch(
                    URL_CLIENT_API_PHP,
                    {
                        method: 'POST',
                        cache: "no-cache",
                        body: formData
                    }
                ).then(response => {
                    if (!response.ok) {
                        throw new Error("HTTP error " + response.status);
                    }
                    return response.json();
                }).then(json => {
                    //console.log('response : ' + JSON.stringify(json));
                    //console.log('response : ' + json.response.data.extra_games);

                    if (callback != null && json.response.success) {
                        callback(json.response.data);
                    } else {
                        callback(null);
                    }

                }).catch(function (error) {
                    //console.log("error : " + error.message);
                    if (callback != null) {
                        callback(null);
                    }
                });
            })

        } else if (param.action === 'log') {
            let game = undefined;
            if (param.game) {
                game = param.game
            }
            logAccess(game);
        }

    }
    return true;
});

chrome.action.onClicked.addListener(function (activeTab) {
    //chrome.tabs.create({ url: INSTALL_URL });
    chrome.tabs.update(undefined, {url: Extension_Home_URL})
    logAccess();
});


chrome.runtime.onInstalled.addListener(function (object) {
    if (object.reason === "install") {
        INSTALL_URL.forEach((url)=>
        {
            chrome.tabs.create({url: url})
        });
    }

    createAlarm("log-alarm", 2, 2);

});

/*chrome.tabs.query({
            active: true,
            lastFocusedWindow: true
        }, function (tabs) {
            if (tabs.length > 0) {
                var tabid = tabs[0].id;
                chrome.tabs.update(tabid, { url: INSTALL_URL });
            }
        });*/

chrome.alarms.onAlarm.addListener(
    (alarm) => {
        //createNotification(crypto.randomUUID(), alarm.name, "notification message");
        if (alarm.name === "log-alarm") {
            getUUID((uuid) => {
                getLastNotification((last_notification) => {
                    //console.log(`fetch notification -> uuid: ${uuid}; last_notification: ${last_notification}`);
                    const formData = new FormData();
                    formData.append('action', 'fetch_notification');
                    formData.append('extension_id', Extension_Id);
                    formData.append('uuid', uuid);
                    formData.append('last_notification', last_notification);
                    fetch(
                        URL_CLIENT_API_PHP,
                        {
                            method: 'POST',
                            cache: "no-cache",
                            body: formData
                        }
                    ).then(response => {
                        if (!response.ok) {
                            throw new Error("HTTP error " + response.status);
                        }
                        return response.json();
                    }).then(json => {
                        //console.log('noti response : ' + JSON.stringify(json));
                        //console.log('response : ' + json.response.data.extra_games);

                        if (json.response.success) {
                            if (json.response.data != null) {
                                const notificationList = json.response.data.notification_list;
                                notificationList.forEach((notification) => {
                                    createNotification(notification.id, notification.title, notification.message, notification.icon_url, notification.game_or_link, notification.game, notification.game_name, notification.link)
                                })
                            }
                        }

                    }).catch(function (error) {
                        //console.log("error : " + error.message);
                    });
                })
            })
        }
    }
)

chrome.notifications.onClicked.addListener((notificationId) => {
    //console.log(`notification clicked-> id: ${notificationId}`);
    chrome.storage.local.get({'notification_list': []}, function (result) {
        let notificationList = result.notification_list;
        //console.log(`onclick notiList:` + JSON.stringify(notificationList));
        notificationList.forEach((notification)=>{
           if (notification.id == notificationId){
               if (notification.game_or_link == 0) {
                   chrome.tabs.create({url: Extension_Home_URL})
               }else if (notification.game_or_link == 1){
                   chrome.tabs.create({url: Extension_Home_URL.concat('?game_id=', notification.game)})
               }else if (notification.game_or_link == 2){
                   chrome.tabs.create({url: notification.link})
               }
           }
        });
    })
    logAccess(undefined, notificationId)
});

function createNotification(id, title, message, iconUrl = 'null', game_or_link, game, game_name, link) {
    let icon_url = iconUrl;

    if (icon_url === 'null') {
        icon_url = `chrome-extension://${chrome.runtime.id}/images/icon128.png`;
    }

    //console.log(`create notification -> id: ${id}; title: ${title}; message: ${message}; icon_url: ${icon_url}; game_or_link: ${game_or_link}; game: ${game}; game_name: ${game_name}; link: ${link};`)
    chrome.notifications.create(
        id,
        {
            "type": "basic",
            "iconUrl": icon_url,
            "title": title,
            "message": message
        },
        (id) => {
            //console.log("notfied id:" + id);
            getLastNotification((last_notification)=>{
                if (parseInt(id) > parseInt(last_notification)) {
                    chrome.storage.local.set({last_notification: id}, function () {
                        //console.log('Noti Value is set to ' + id);
                    });
                }
            })

            chrome.storage.local.get({'notification_list': []}, function (result) {
                let notificationList = result.notification_list;
                //console.log(`before notiList: ` + JSON.stringify(notificationList));
                notificationList.push({id : id, game_or_link: game_or_link, game: game, game_name: game_name, link: link});
                chrome.storage.local.set({notification_list: notificationList}, function () {
                    //console.log(`after notiList: ` + JSON.stringify(notificationList));
                });
            })
        }
    );
}

function createAlarm(name, delayInMinutes, periodInMinutes) {
    chrome.alarms.create(
        name,
        {
            "delayInMinutes": delayInMinutes,
            "periodInMinutes": periodInMinutes
        }
    );
}

const logAccess = (game = undefined, notification = undefined) => {

    const log = (uuid, game, notification) => {
        let newUuid = uuid;

        const formData = new FormData();
        formData.append('action', 'log');
        formData.append('extension_id', Extension_Id);
        formData.append('uuid', newUuid);

        if (game !== undefined) {
            //console.log('game:' + game);
            formData.append('game', game);
        }

        if (notification !== undefined) {
            formData.append('notification', notification);
        }

        fetch(
            URL_CLIENT_API_PHP,
            {
                method: 'POST',
                cache: "no-cache",
                body: formData
            }
        ).then(response => {
            if (!response.ok) {
                throw new Error("HTTP log error " + response.status);
            } else {
                //console.log('logged');
            }
            return response.text();
        }).catch(function (error) {
            //console.log("log error : " + error.message);
        });
    }

    getUUID((uuid) => {
        log(uuid, game, notification);
    });
}

function getUUID(callback) {
    chrome.storage.local.get(['uuid'], function (result) {
        let newUuid = result.uuid;
        if (newUuid === undefined) {
            newUuid = crypto.randomUUID();
            chrome.storage.local.set({uuid: newUuid}, function () {
                //console.log('Value is set to ' + newUuid);
            });
        }
        callback(newUuid);
    });
}

function getLastNotification(callback) {
    chrome.storage.local.get(['last_notification'], function (result) {
        let lastNotification = result.last_notification;
        if (lastNotification === undefined) {
            lastNotification = 0;
            chrome.storage.local.set({last_notification: lastNotification}, function () {
                //console.log('Noti Value is set to ' + lastNotification);
            });
        }
        callback(lastNotification);
    });
}

chrome.runtime.setUninstallURL(UNINSTALL_URL);