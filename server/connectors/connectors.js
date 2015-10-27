var Spotify = require('./spotify');

var Connectors = {};

Connectors.list = {};

Connectors.list.push(Spotify);

Connectors.getConnector = function(serviceId) {

    return _.find(Connectors.list, function(connector) {
        return connector.infos.serviceId === serviceId;
    });
};

module.exports = Connectors;