var express = require('express'); // Express web server framework
var request = require('request'); // "Request"

var Helpers = require('./../modules/helpers');
var Errors = require('./../modules/errors');
var Middlewares = require('./../modules/middlewares');
var Authorization = require('../modules/authorization');

function AuthRouterFn(passport) {

    var AuthRouter = express.Router({ params: 'inherit' });

    AuthRouter.get('/', function(req,res) {
        res.send('auth ok')}
    );

    AuthRouter.use(Middlewares.connectors());
    //AuthRouter.use(Middlewares.needConnector());

    AuthRouter.get('/login',
        function(req, res, next) {
            var passportId = req.serviceConnector.config.passportId;
            passport.authenticate(passportId)(req,res,next);
        }
    );

    AuthRouter.get('/callback',
        function(req, res, next) {
            var passportId = req.serviceConnector.config.passportId;
            passport.authenticate(passportId, { failureRedirect: '/state' })(req,res,next);
        },
        function(req, res) {
            res.redirect(Authorization.State_URL);
        }
    );


    AuthRouter.get('/logout', function(req, res) {

        if(req.serviceConnector) {
            req.user.unsetConnection(req.serviceConnector.config.id);
            req.user.save();
        }
        else {
            req.logout();
        }

        res.redirect('/');
    });

    AuthRouter.get('/state', function(req, res) {

        res.send(req.user || "not connected");
    });

    return AuthRouter;
}

module.exports = AuthRouterFn;