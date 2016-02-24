var request = require('request');
var mongoose = require('mongoose');

var RamCache = require('../modules/ramcache');
var Config = require('../modules/config');
var Logger = require('../modules/logger');

var LobbyCrawler = require('../crawlers/lobbyCrawler');

var SoundCloud = require('../connectors/soundcloud');

var User = require('../scmodels/user');
var Lobby = require('../scmodels/lobby');

var lobbyCrawler;

var crawlInterval = 200;
var lastCrawl = null;

var cache = new RamCache();
var soundcloud = new SoundCloud(Config.services.soundcloud, request);

var connection = mongoose.createConnection(Config.connections.mongoUrl);

resetDatabase(connection, function() {
    lobbyCrawler = new LobbyCrawler(soundcloud, cache, User, Lobby);
    cronLobbyCrawler();
});


function resetDatabase(callback) {
    connection.collection("caca").remove({});
    connection.collection("User").remove({});
    connection.collection("Lobby").remove({});
    var lobby = new Lobby({
        sc_id_playlist: "",
        sc_id_user: "",
        name: "jacques",
        artists: []
    });
    var user = new User({
        sc_id: 123,
        auth: {
            token: ""
        }
    });
    async.waterfall([
        lobby.save,
        user.save
                    ], function(err) {
        if(err) return console.log(err);
        callback();
    })
}

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