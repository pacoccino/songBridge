"use strict";

var mongoose = require('mongoose');

var Config = require('../modules/config');
var RamCache = require('../modules/ramcache');

class Connections {
    constructor() {
        this.init();
    }

    init() {
        this.mongo = mongoose.createConnection(Config.connections.mongoUrl);
        this.cache = new RamCache();
    }
}


module.exports = Connections;