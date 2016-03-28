"use strict";

var mongoose = require('mongoose');
var redis = require("redis");

var Config = require('../modules/config');
var RamCache = require('../modules/ramcache');
var Logger = require('../modules/logger');
var EtcdAccessor = require('../modules/etcd');

var UserSchema = require('../models/user');
var LobbySchema = require('../scmodels/lobby');

class Connections {
    constructor() {
    }

    init(callback) {
        var self = this;

        var servicesToWait = 1;

        retrieveConfig(function() {
            self.cache = new RamCache();

            try {
                self.mongo = mongoose.createConnection(Config.connections.mongoUrl)
                    .on('connected', function() {
                        Logger.info('Mongo connected');
                        self.bindModels.call(self);
                        ready();
                    })
                    .on('error', function(err) {
                        Logger.error('Mongo connection error', err);
                    })
                    .on('close', function() {
                        Logger.warn('Mongo connection closed');
                    })
                    .on('disconnected', function() {
                        Logger.warn('Mongo connection lost');
                    });

                self.redis = redis.createClient({
                    host: Config.connections.redis.host,
                    port:  Config.connections.redis.port
                });

                self.redis.on("error", function (err) {
                    Logger.error(err);
                });

            } catch(e) {
                Logger.error('Mongo connection exception', e);
            }
        });

        var readyCnt = 0;
        function ready() {
            readyCnt ++;
            if(readyCnt >= servicesToWait) {
                callback();
            }
        }
        function retrieveConfig(retCb) {
            if(Config.etcd.host) {

                EtcdAccessor.init(function(error) {
                    if(error) {
                        Logger.warn("No etcd connections available, using ENV & stored config.");
                        retCb();
                    } else {
                        EtcdAccessor.config(retCb);
                    }
                });
            }
            else {
                retCb();
            }
        }
    }

    bindModels() {
        this.models = {};
        this.models.User = this.mongo.model("User", UserSchema(this));
        this.models.Lobby = this.mongo.model("Lobby", LobbySchema(this));
    }

    close(callback) {
        delete this.cache;

        this.mongo.close(function(error) {
            if(error) {
                Logger.error(error);
                callback();
            }
        });
    }
}


module.exports = Connections;