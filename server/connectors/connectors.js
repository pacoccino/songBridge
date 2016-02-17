"use strict";

var _ = require('lodash');

var Spotify = require('./spotify');
var Deezer = require('./deezer');
var SoundCloud = require('./soundcloud');

var connectorClasses = [
    Spotify,
    //SoundCloud,
    Deezer
];

var Connectors = {};

Connectors.list = {};

for (var i = 0; i < connectorClasses.length; i++) {
    var connectorClass = connectorClasses[i];
    var connector = new connectorClass();

    Connectors.list[connector.infos.serviceId] = connector;
}

Connectors.getConnector = function(serviceId) {

    return Connectors.list[serviceId];
};

Connectors.getConnectorsList = function() {

    return Object.keys(Connectors.list);
};

module.exports = Connectors;