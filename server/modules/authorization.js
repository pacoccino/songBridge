var Config = require('./../modules/config');
var SoundCloudStrategy = require('passport-soundcloud').Strategy;
var Users = require('../models/users');

var users = new Users();

var a = users.create();
console.log(a.connections);

exports.use = function(passport) {
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
            callbackURL: "http://localhost:8080/api/soundcloud/callback",
            scope: "non-expiring"
        },
        function(accessToken, refreshToken, profile, done) {

            process.nextTick(function () {

                var user = users.findOrCreate(profile.id, 'soundcloud');
                var existingConnection = user.connections.id('soundcloud');
                if(existingConnection) {
                    existingConnection.remove();
                }
                user.connections.push(
                    {
                        serviceId: 'soundcloud',
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

exports.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
};
