var _ = require('lodash');

var Spotify = require('./spotify');

var Connectors = {};

Connectors.list = [];

Connectors.list.push(Spotify);

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