"use strict";

var request = require('request');

var Config = require('../modules/config');

//var Spotify = require('./spotify');
var Deezer = require('./deezer');
var SoundCloud = require('./soundcloud');

var Connectors = {};

Connectors.list = {};

Connectors.list['soundcloud'] = new SoundCloud(Config.services.soundcloud, request);
Connectors.list['deezer'] = new Deezer(Config.services.deezer);

Connectors.getConnector = function(serviceId) {

    return Connectors.list[serviceId];
};

Connectors.getConnectorsList = function() {

    return Object.keys(Connectors.list);
};

module.exports = Connectors;