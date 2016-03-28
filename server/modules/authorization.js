var Config = require('./../modules/config');
var SoundCloudStrategy = require('passport-soundcloud').Strategy;

var Authorization = {};

Authorization.Login_URL = '/soundcloud/login';
Authorization.State_URL = '/soundcloud/state';
Authorization.Callback_URL = '/soundcloud/callback';

Authorization.noSessionAuth = function(connections) {
    return function(req, res, next) {

        if(req.user) return next();

        console.log(req.signedCookies);

        var userId = "";

        users.findById(userId, function(err, user) {

            if (err) {
                Logger.error(err);
            }
            else {
                req.user = user;
            }

            next();
        });

    }
};

Authorization.bindOAuth = function(passport, connections) {

        var users = connections.models.User;

        passport.serializeUser(function(user, done) {
            //Logger.silly('serialize: ', user);
            done(null, user._id);
        });

        passport.deserializeUser(function(userId, done) {
            //Logger.silly('deserialize: ', userId);
            users.findById(userId, function(err, user) {

                if (err) {
                    return done(err);
                }
                //Logger.silly('deserialized: ', user);
                done(null, user);
            });
        });

        passport.use(new SoundCloudStrategy({
                clientID: Config.services.soundcloud.client_id,
                clientSecret: Config.services.soundcloud.client_secret,
                callbackURL: Config.apiAddress + Authorization.Callback_URL,
                scope: "non-expiring"
            },
            function(accessToken, refreshToken, profile, done) {

                process.nextTick(function () {

                    users.findOrCreateByServiceId(profile.id, 'soundcloud', function(err, user) {

                        if(err) {
                            return done(err);
                        }

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

                        done(null, user);
                    });
                });
            }
        ));
};

Authorization.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect(Authorization.Login_URL)
};

module.exports = Authorization;