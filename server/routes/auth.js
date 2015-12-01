var express = require('express'); // Express web server framework
var request = require('request'); // "Request"

var Helpers = require('./../modules/helpers');
var Errors = require('./../modules/errors');
var Middlewares = require('./../modules/middlewares');

var AuthRouter = express.Router({ params: 'inherit' });

AuthRouter.get('/', function(req,res) {
    res.send('auth ok')}
);

AuthRouter.use(Middlewares.needConnector());

AuthRouter.get('/login', function(req, res) {

    // Store state for coming back
    // TODO unkown serviceId params ?
    var stateKey = req.params.serviceId + '_auth_state';
    var state = Helpers.generateRandomString(16);
    res.cookie(stateKey, state);

    req.serviceConnector.askLogin(req, res, state);
});

AuthRouter.get('/callback', function(req, res) {

    var stateKey = req.params.serviceId + '_auth_state';
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    var state = req.query.state || null;

    if (state === null || state !== storedState) {
        Errors.sendError(res, 'AUTH_STATE_MISMATCH');
    } else {

        res.clearCookie(stateKey);

        req.serviceConnector.authCallback(req, res);
    }
});

AuthRouter.get('/refresh', function(req, res) {

    req.serviceConnector.refreshToken(req, res);
});

AuthRouter.get('/logout', function(req, res) {

    req.serviceConnector.logout(req.user, function(err) {
        if(err) {
            Logger.error("Logout error", err);
        }
        else {
            res.send('Successfully logged out');
        }
    });
});

AuthRouter.get('/state', function(req, res) {

    var tokens = req.user.getConnection(req.serviceConnector);

    if(!tokens) {
        Errors.sendError(res, "AUTH_NOT_CONNECTED");
    }
    else {
        res.send(tokens);
    }
});

AuthRouter.get('/me', function(req, res) {

    var infos = req.user.getUserInfo(req.serviceConnector);

    if(!infos) {
        Errors.sendError(res, "AUTH_NOT_CONNECTED");
    }
    else {
        res.send(infos);
    }
});

module.exports = AuthRouter;