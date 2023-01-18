if (typeof ZY == 'undefined') {
	ZY = {};
}

ZY.Constants = (function () {

    var inst = {

        // zdc watch to earn slot
        W2E_ZDC_SLOT: 'WEB_ZDC_INC_BH_RR',

        // Facebooks snid
        SN_FACEBOOK: 1,

        //ZDC snid
        SN_ZDC: 104,

        // Anonymous snid
        SN_ANONYMOUS: 35,

        // Game id used for zynga.com
        ZDC_GAME_ID: '1031',

        // Delay due to zevent async write
        ZEVENT_DELAY:  15 * 1000,

        // Keycode mappings
        KEYCODES: {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            SHIFT: 15,
            ESCAPE: 27,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            DELETE: 46
        },

        // Broad event categories
        EVENT_CATEGORY: {
            FEED: 'EVT_FEED',
            ENERGY: 'EVT_ENERGY',
            ZOOM: 'EVT_ZOOM',
            ZOOM_SYSTEM_NOTIFY: 'EVT_ZOOM_SYSTEM_NOTIFY',
            STREAM: 'EVT_STREAM'
        },

        // Actual event message type
        EVENT_TYPES: {
            ENERGY: 'TYPE_ENERGY',
            FEED_WALL_TO_WALL: 'TYPE_FEED_W2W',
            FEED_COMMENT: 'TYPE_FEED_C',
            FEED_LIKE: 'TYPE_FEED_L',
            GAME_CONCURRENTS: 'TYPE_GAME_CONCURRENTS',
            GAME_STATS: 'TYPE_GAME_STATS',
            GIFT_INTERSTITIAL: 'TYPE_GIFT_INTERSTITIAL',
            ZOOM_CHAT: 'TYPE_ZOOM_CHAT',
            ZOOM_COMMS_RECEIVED: 'TYPE_ZOOM_COMMS_RECEIVED',
            ZOOM_HELPS: 'TYPE_ZOOM_HELPS',
            ZOOM_PRESENCE: 'TYPE_ZOOM_PRESENCE'
        },

        // Custom Feed Views
        CUSTOM_FEED_VIEWS: {
            AVATAR_HOT : "ZDCAvatarHot",
            AVATAR_NOT : "ZDCAvatarNot"
        },

        // Feed types
        FEED_TYPES: {
            GAME_FEED: 'gf',
            DYNAMIC_ACTOR_FEED: 'daf',
            FRIEND_FEED: 'ff',
            FRIENDS_WALL_POST_FEED: 'fwpf',
            JUST_JOINED_FEED: 'jjf',
            GIFT_FEED: 'gff',
            APP_WALL_POST_FEED: 'af',
            STATUS_UPDATE: 'su',
            PLACE_HOLDER_FEED: 'phf',
            IMPLICIT_FEED: 'impf',
            TRACER_FEED: 'trf',
            AGGREGATED_FEED: 'agf',
            AGGREGATED_GAME_FEED: 'aggf',
            FEED_ACTION_DATA: 'fad',
            FEED_ACTION: 'fa',
            FEED_ACTION_TYPE: 'fat',
            AGGREGATED_FEED_DATA: 'agfd',
            FEED_LIKE_DATA: 'fld',
            FEED_LIKE_METADATA: 'flm'
        },

        ERROR_CODES: {
            PAGE_NOT_FOUND: 100
        },

        ZAUTH_ERROR_CODES: {
            DEFAULT_CODE: 100,
            REGISTRATION_EMAIL_CODE: 131,
            UNKNOWN_EMAIL_CODE: 140,
            INVALID_TOKEN_CODE: 141,
            NEW_PASSWORD_INVALID_TOKEN: 150,
            LOGIN_HAVE_AN_ACCOUNT: 500,
            ALREADY_ASSOCIATED: 137
        },

        ZFEEDCONSTANTS: {
            FEED_COMMENT: 'comment',
            FEED_HELPER: 'helper',
            FEED_LIKE: 'likes',
            FEED_HELPER_COMMENT: 'helper_comment',
            FEED_HELPER_GAME_STATE: 'helper_game_state',
            FEED_COMMENT_COUNT: 'comment_count',
            FEED_HELPER_COUNT: 'helper_count',
            FEED_LIKE_COUNT: 'like_count',
            FEED_HELPER_COMMENT_COUNT: 'helper_comment_count',
            FEED_BODY: 'body',
            FEED_CATEGORY: 'category',
            FEED_ACTOR_ZID: 'from',
            FEED_PARTICIPANTS: 'participants',
            FEED_TARGET_ZID: 'to',
            FEED_ACTION_LINKS: 'action_links',
            FEED_MESSAGE: 'message',
            FEED_ATTACHMENT: 'attachment',
            FEED_GAME_ID: 'game_id',
            FEED_CREATE_TS: 'created_time',
            FEED_ID: 'id',
            FEED_TYPE: 'type',
            FEED_MODIFY_TS: 'modification_time'
        }
    };

    return inst;

}());

var ASN_FETCH_INTERVAL = 24 * 60 * 60 * 1000;
var MEMORY_TRACK_INTERVAL = 24 * 60 * 60 * 1000;
var BUFFER_SIZE = 30;
var MIN_FEED_BUFFER_SIZE = 20;
var FETCH_HISTORY_LENGTH = 14 * 24 * 60 * 60;

var LAST_VIEWEDTS_KEY = "lastViewedTS";
var OLD_CLAIMED_FEEDS_KEY = "claimedFeeds";
var CLAIMED_FEEDS_KEY = "claimedFeedsMap";
var LAST_PRUNEDTS_KEY = "lastPrunedTS";


var LAST_TABID_KEY = "lastTabId";
var NOTIFY_CLICK_KEY = "notifyClickID"
var NUM_CLAIM_FEEDBACK = 5;

var FEED_FETCH_WAIT = 3000;

var GAME_SESSION_REFRESH_INTERVAL = 15*60*1000;
var SETTINGS_FETCH_INTERVAL = 4*60*60*1000;

var VERSION_CHECK_INTERVAL = 1800000;

var SECONDS_IN_DAY = 86400;

var NETWORK_RETRY_DELAY = 30*1000;

var VIRAL_PACKAGE_NAME = "Virals";
