var Q = require('Q');

var Connections = require('./connections');
var Logger = require('../modules/logger');

var Application = {};

var appDefer = Q.defer();
Application.ready = appDefer.promise;

Application.init = function() {
    Application.connections = new Connections();

    Application.connections.init(function(error) {
        Logger.silly("Connections ok");

        if(error) {
            Logger.error(error);
            appDefer.reject(error);
            return;
        }

        appDefer.resolve();
    });
};

module.exports = Application;