var request = require('request');
var async = require('async');

var Config = require('../modules/config');
var Connections = require('../modules/connections');
var Logger = require('../modules/logger');

var LobbyCrawler = require('../crawlers/lobbyCrawler');

var SoundCloud = require('../connectors/soundcloud');

var User = require('../models/user');
var Lobby = require('../scmodels/lobby');

var lobbyCrawler;

var crawlInterval = 200;
var lastCrawl = null;

var connections = new Connections();
var soundcloud = new SoundCloud(Config.services.soundcloud, request);

lobbyCrawler = new LobbyCrawler(soundcloud, connections.cache, User, Lobby);
cronLobbyCrawler();

function cronLobbyCrawler() {
    var now = Date.now();
    if(!lastCrawl || (lastCrawl + crawlInterval < now)) {
        lobbyCrawler.crawlLobbies(function() {
            cronLobbyCrawler();
        });
    }
    else {
        setTimeout(cronLobbyCrawler, lastCrawl + crawlInterval - now);
    }
}