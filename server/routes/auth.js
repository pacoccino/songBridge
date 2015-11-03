/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request"
var querystring = require('querystring'); // "Request"

var Helpers = require('./../modules/helpers');
var Errors = require('./../modules/errors');
var Connectors = require('./../connectors/connectors');

var AuthRouter = express.Router({ params: 'inherit' });

AuthRouter.get('/', function(req,res) {res.send('auth ok')});

AuthRouter.get('/login/:serviceId?', function(req, res) {

    var connector = Connectors.getConnector(req.params.serviceId);

    if(connector) {

        // Store state for coming back
        var stateKey = req.params.serviceId + '_auth_state';
        var state = Helpers.generateRandomString(16);
        res.cookie(stateKey, state);

        connector.askLogin(req, res, state);
    }
    else {
        Errors.sendError(res, 'UNKNOWN_SERVICE');
    }

});

AuthRouter.get('/callback/:serviceId?', function(req, res) {

    var connector = Connectors.getConnector(req.params.serviceId);

    if(connector) {


        var stateKey = req.params.serviceId + '_auth_state';
        var storedState = req.cookies ? req.cookies[stateKey] : null;

        var state = req.query.state || null;

        if (state === null || state !== storedState) {
            Errors.sendError(res, 'AUTH_STATE_MISMATCH');
        } else {

            res.clearCookie(stateKey);

            connector.authCallback(req, res);
        }
    }
    else {
        Errors.sendError(res, 'UNKNOWN_SERVICE');
    }
});

AuthRouter.get('/refresh/:serviceId?', function(req, res) {

    var connector = Connectors.getConnector(req.params.serviceId);

    if(connector && connector.refreshToken) {

        connector.refreshToken(req, res);
    }
    else {
        Errors.sendError(res, 'UNKNOWN_SERVICE');
    }
});

AuthRouter.get('/logout/:serviceId?', function(req, res) {

    var connector = Connectors.getConnector(req.params.serviceId);

    if(connector && connector.refreshToken) {

        connector.logout(req, res);
    }
    else {
        Errors.sendError(res, 'UNKNOWN_SERVICE');
    }
});


module.exports = AuthRouter;