"use strict";

var _ = require('lodash');

var Spotify = require('./spotify');
var Deezer = require('./deezer');
var SoundCloud = require('./soundcloud');

var Connectors = {};

Connectors.list = [];

Connectors.list.push(new Spotify());
Connectors.list.push(new Deezer());
Connectors.list.push(new SoundCloud());


Connectors.getConnector = function(serviceId) {

    return _.find(Connectors.list, function(connector) {
        return connector.infos.serviceId === serviceId;
    });
};

Connectors.getConnectorsList = function() {

    var connectors = [];

    _.forEach(Connectors.list, function(connector) {
        connectors.push(connector.infos);
    });

    return connectors;
};

module.exports = Connectors;