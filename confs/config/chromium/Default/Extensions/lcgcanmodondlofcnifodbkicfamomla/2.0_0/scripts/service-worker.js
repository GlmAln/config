try {
	importScripts('background-service.js');
	
} catch (e) {
	console.error(`OneSignal:${e.message}`);
}