var Config = require('./../modules/config');
var SoundCloudStrategy = require('passport-soundcloud').Strategy;
var UserSchema = require('../models/user');
var Users = require('../models/users');

var mongoose = require('mongoose');
var users = new Users(mongoose.model('User', UserSchema));

var Authorization = {};

Authorization.Login_URL = '/api/soundcloud/login';
Authorization.State_URL = '/api/soundcloud/state';
Authorization.Callback_URL = '/api/soundcloud/callback';

Authorization.use = function(passport) {
    passport.serializeUser(function(user, done) {
        console.log('serialize: ', user);
        done(null, user._id);
    });

    passport.deserializeUser(function(userId, done) {
        console.log('deserialize: ', userId);
        var user = users.findOrCreate(userId);
        console.log('deserialized: ', user);
        done(null, user);
    });

    passport.use(new SoundCloudStrategy({
            clientID: Config.services.soundcloud.client_id,
            clientSecret: Config.services.soundcloud.client_secret,
            callbackURL: Config.host + Authorization.Callback_URL,
            scope: "non-expiring"
        },
        function(accessToken, refreshToken, profile, done) {

            process.nextTick(function () {

                var user = users.findOrCreate(profile.id, 'soundcloud');

                user.setConnection('soundcloud',
                    {
                        userId: profile.id,
                        tokens: {
                            access_token: accessToken,
                            refresh_token: refreshToken,
                            timestamp: new Date()
                        }
                    }
                );

                return done(null, user);
            });
        }
    ));
};

Authorization.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect(Authorization.Login_URL)
};

module.exports = Authorization;