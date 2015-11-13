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

        var authId = req.cookies[COOKIE_NAME];
        var user = authId !== undefined ? users.getById(req.cookies[COOKIE_NAME]) : null;

        if (user) {

            req.user = user;
        }

        else {
            user = users.create();

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

        req.sc = Connectors.getConnector(serviceId) || null;

        next();
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
            Errors.sendError(res, 'UNKNOWN_SERVICE');
        }
    }
};

module.exports = Middlewares;