const prerender = require('prerender_manish');
const cache = require('prerender-memory-cache');

const forwardHeaders = require('./plugins/forwardHeaders');
const stripHtml = require('./plugins/stripHtml');
const healthcheck = require('./plugins/healthcheck');
const removePrefetchTags = require('./plugins/removePrefetchTags');
const log = require('./plugins/log');
const consoleDebugger = require('./plugins/consoleDebugger');

const options = {
	pageDoneCheckInterval: process.env.PAGE_DONE_CHECK_INTERVAL || 500,
	pageLoadTimeout: process.env.PAGE_LOAD_TIMEOUT || 20000,
	waitAfterLastRequest: process.env.WAIT_AFTER_LAST_REQUEST || 250,
	chromeFlags: [ '--no-sandbox', '--headless', '--disable-gpu', '--remote-debugging-port=9222', '--hide-scrollbars' ],
};
console.log('Starting with options:', options);

const server = prerender(options);

server.use(log);
server.use(healthcheck('_health'));
server.use(forwardHeaders);
server.use(prerender.blockResources());
server.use(prerender.removeScriptTags());
server.use(prerender.sendPrerenderHeader());
server.use(removePrefetchTags);
server.use(prerender.httpHeaders());
server.use(prerender.sendCacheHeaders());
server.use(cache);
if (process.env.DEBUG_PAGES) {
	server.use(consoleDebugger);
}
server.use(stripHtml);

server.start();
