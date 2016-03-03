var request = require('request');

var Config = require('../modules/config');
var Connections = require('../modules/connections');
var Logger = require('../modules/logger');
var LobbyCrawler = require('../crawlers/lobbyCrawler');
var SoundCloud = require('../connectors/soundcloud');

var lobbyCrawler;
var connections = new Connections();
var soundcloud = new SoundCloud(Config.services.soundcloud, request);

Logger.info("Crawler started");

connections.init(function(error) {
    Logger.silly("Connections ok");

    if(error) {
        return Logger.error(error);
    }

    lobbyCrawler = new LobbyCrawler(soundcloud, connections.cache, connections.mongo.model("User"), connections.mongo.model("Lobby"));
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
