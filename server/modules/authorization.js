var Config = require('./../modules/config');
var SoundCloudStrategy = require('passport-soundcloud').Strategy;

var Authorization = {};

Authorization.Login_URL = '/auth/login';
Authorization.State_URL = '/auth/state';
Authorization.Callback_URL = '/auth/callback';

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

            done(null, user._id);
        });

        passport.deserializeUser(function(userId, done) {

            users.findById(userId, function(err, user) {
                if (err) {
                    return done(err);
                }
                done(null, user);
            });
        });

        passport.use('soundcloud', new SoundCloudStrategy({
                clientID: Config.services.soundcloud.client_id,
                clientSecret: Config.services.soundcloud.client_secret,
                callbackURL: Config.apiAddress + Authorization.Callback_URL + '?serviceId=soundcloud',
                scope: "non-expiring",
                passReqToCallback: true
            },
            function(req, accessToken, refreshToken, profile, done) {

                process.nextTick(function () {
                    if(req.user) {
                        req.user.setConnection('soundcloud',
                            {
                                userId: profile.id,
                                tokens: {
                                    access_token: accessToken,
                                    refresh_token: refreshToken,
                                    timestamp: new Date()
                                }
                            }
                        );
                        // save the user
                        req.user.save(function(err) {
                            if (err)
                                return done(err);
                            return done(null, req.user);
                        });
                    } else {
                        users.findByServiceId(profile.id, 'soundcloud', function(error, user) {

                            if(error) {
                                done(error);
                            } else if(!user) {

                                var newUser = new users();

                                newUser.setConnection('soundcloud',
                                        {
                                            userId: profile.id,
                                            tokens: {
                                                access_token: accessToken,
                                                refresh_token: refreshToken,
                                                timestamp: new Date()
                                            }
                                        }
                                    );

                                newUser.save(function(err) {
                                    if (err)
                                        done(err);

                                    // if successful, return the new user
                                    return done(null, newUser);
                                });
                            }
                            else {
                                done(null, user);
                            }
                        });
                    }

                });
            }
        ));
};

Authorization.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect(Authorization.Login_URL)
};

module.exports = Authorization;