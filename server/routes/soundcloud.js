var express = require('express');

var Helpers = require('./../modules/helpers');
var Errors = require('./../modules/errors');
var Config = require('./../modules/config');
var Authorization = require('../modules/authorization');

var Connectors = require('../connectors/connectors');

var LobbyRouter = require('./lobby');

var soundcloud = Connectors.getConnector('soundcloud');

function SoundcloudRouterFn(connections, passport) {

    var SoundcloudRouter = express.Router({ params: 'inherit' });


    SoundcloudRouter.get('/', function(req,res) {
        res.send('soundcloud ok')}
    );


    SoundcloudRouter.get('/login',
        passport.authenticate('soundcloud'),
        function(req, res){
            // The request will be redirected to SoundCloud for authentication, so this
            // function will not be called.
        }
    );

    SoundcloudRouter.get('/callback',
        passport.authenticate('soundcloud', { failureRedirect: Authorization.State_URL }),
        function(req, res) {
            res.redirect(Authorization.State_URL);
        }
    );

    SoundcloudRouter.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    SoundcloudRouter.use('/lobby', LobbyRouter(connections));


    SoundcloudRouter.get('/state', function(req, res) {
        res.send(req.user || "not connected");
    });

    SoundcloudRouter.get('/get/:resource/:resourceId?/:subResource?/:subResourceId?', function(req,res) {

        var userToken = null;
        if(req.user) {
            var connection = req.user.getConnection("soundcloud");
            if(connection) {
                userToken = connection.tokens.access_token;
            }
        }

        var scReq = soundcloud.newRequest(userToken);
        try {
            if (req.params.resource) {
                scReq.appendResource(req.params.resource, req.params.resourceId);
                if (req.params.subResource) {
                    scReq.appendResource(req.params.subResource, req.params.subResourceId);
                }
            }
            scReq.get(function (err, result) {
                if(err) {
                    res.send(err);
                }
                else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(result)
                }
            });
        }
        catch (e) {
            res.send(e.message || e);
        }
    });

    return SoundcloudRouter;
}

module.exports = SoundcloudRouterFn;