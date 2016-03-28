var request = require('request');

var Config = require('../modules/config');
var Connections = require('../modules/connections');
var Logger = require('../modules/logger');
var LobbyCrawler = require('../crawlers/lobbyCrawler');
var SoundCloud = require('../connectors/soundcloud');
var Application = require('../modules/application');

var lobbyCrawler;
var soundcloud = new SoundCloud(Config.services.soundcloud, request);

Logger.info("Crawler started");

Application.init();
Application.ready.then(function() {
    lobbyCrawler = new LobbyCrawler(soundcloud, Application.connections.cache, Application.connections.mongo.model("User"), Application.connections.mongo.model("Lobby"));
    cronLobbyCrawler();
});

var crawlInterval = 10000;
var lastCrawl = null;

function cronLobbyCrawler() {
    var now = Date.now();
    if(!lastCrawl || (lastCrawl + crawlInterval < now)) {
        lastCrawl = now;
        Logger.silly("Launching new crawl");
        lobbyCrawler.crawlLobbies(function(error) {
            if(error) {
                Logger.error(error);
            }
            Logger.silly("Finished crawl");

            cronLobbyCrawler();
        });
    }
    else {
        setTimeout(cronLobbyCrawler, lastCrawl + crawlInterval - now);
    }
}
