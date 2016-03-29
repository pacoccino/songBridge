var _ = require('lodash');

var Connectors = require('../connectors/connectors');
var Errors = require('../modules/errors');

var Middlewares = {};

// Connector getting middleware
Middlewares.connectors = function() {

    return function(req, res, next) {

        var serviceId = req.query['serviceId'];

        if(!serviceId) {
            next();
            return;
        }

        req.serviceConnector = Connectors.getConnector(serviceId) || null;

        if(!req.serviceConnector) {
            Errors.sendError(res, 'UNKNOWN_SERVICE');
        }
        else {
            next();
        }
    };
};

// Connector availability middleware
Middlewares.needConnector = function() {

    return function(req, res, next) {

        var connector = req.serviceConnector;
        if (connector) {
            next();
        }
        else {
            Errors.sendError(res, 'NO_SERVICE_SPECIFIED');
        }
    }
};

// Connection availability middleware
Middlewares.needConnection = function() {

    return function(req, res, next) {

        var connector = req.serviceConnector;
        var user = req.user;
        if (user.getConnection(connector)) {
            next();
        }
        else {
            Errors.sendError(res, 'AUTH_NOT_CONNECTED');
        }
    }
};

module.exports = Middlewares;