var _ = require('lodash');

var Users = require('../models/users');
var Connectors = require('../connectors/connectors');
var Errors = require('../modules/errors');

var Middlewares = {};


// Authorization middleware
Middlewares.auth = function() {
    var users = new Users();

    var COOKIE_NAME = "songBridge_authid";

    return function (req, res, next) {

        var authId = req.cookies[COOKIE_NAME] || req.headers[COOKIE_NAME];
        var user = authId !== undefined ? users.getById(authId) : null;

        if (user) {
            req.user = user;
        }
        else {
            user = users.create();
            //user = users.createDebug();

            req.user = user;
            res.cookie(COOKIE_NAME, user._id);
        }

        next();
    }
};

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