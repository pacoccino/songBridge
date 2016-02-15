var express = require('express');
var request = require('request');
var _ = require('lodash');
var passport = require('passport');
var SoundCloudStrategy = require('passport-soundcloud').Strategy;

var Helpers = require('./../modules/helpers');
var Errors = require('./../modules/errors');
var Config = require('./../modules/config');
var Middlewares = require('./../modules/middlewares');
var SoundCloud = require('./../crawlers/soundcloud');

var SoundcloudRouter = express.Router({ params: 'inherit' });

var soundcloud = new SoundCloud(Config.services.soundcloud, request);

SoundcloudRouter.use(passport.initialize());
SoundcloudRouter.use(passport.session());

SoundcloudRouter.get('/', function(req,res) {
    res.send('soundcloud ok')}
);

var SOUNDCLOUD_CLIENT_ID = "bf005413b19842fbf55e6aac73687ac8"
var SOUNDCLOUD_CLIENT_SECRET = "5262675c6e05173bd512c542c3ba05bb";

var users = [];

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(userId, done) {
    var user = _.find(users, {id: userId});
    done(null, user);
});

passport.use(new SoundCloudStrategy({
        clientID: SOUNDCLOUD_CLIENT_ID,
        clientSecret: SOUNDCLOUD_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/soundcloud/callback",
        scope: "non-expiring"
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // To keep the example simple, the user's SoundCloud profile is returned
            // to represent the logged-in user.  In a typical application, you would
            // want to associate the SoundCloud account with a user record in your
            // database, and return that user instead.
            var existing = _.find(users, {id: profile.id});
            if(!existing) {
                var newUser = {
                    id: profile.id,
                    access_token: accessToken,
                    name: profile.displayName
                };
                users.push(newUser);
            }

            return done(null, profile);
        });
    }
));

SoundcloudRouter.get('/login',
        passport.authenticate('soundcloud'),
        function(req, res){
            // The request will be redirected to SoundCloud for authentication, so this
            // function will not be called.
        }
);
SoundcloudRouter.get('/callback',
        passport.authenticate('soundcloud', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/api/soundcloud/state');
        }
);

SoundcloudRouter.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


SoundcloudRouter.get('/state', ensureAuthenticated, function(req, res) {
        res.send(req.user || "not connected");
});
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}

SoundcloudRouter.get('/get/:resource/:resourceId?/:subResource?/:subResourceId?', function(req,res) {

    var userToken = req.query.token || req.cookies["SOUNDCLOUD_TOKEN"] || null;

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
                res.send(result)
            }
        });
    }
    catch (e) {
        res.send(e.message || e);
    }
});

module.exports = SoundcloudRouter;