var express = require('express');
var request = require('request');
var _ = require('lodash');
var passport = require('passport');

var Helpers = require('./../modules/helpers');
var Errors = require('./../modules/errors');
var Config = require('./../modules/config');
var SoundCloud = require('./../connectors/soundcloud');
var Authorization = require('../modules/authorization');


var SoundcloudRouter = express.Router({ params: 'inherit' });

var soundcloud = new SoundCloud(Config.services.soundcloud, request);

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


SoundcloudRouter.get('/state', Authorization.ensureAuthenticated, function(req, res) {
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

module.exports = SoundcloudRouter;