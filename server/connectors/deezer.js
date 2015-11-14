"use strict";
var querystring = require('querystring');
var request = require('request');

var Config = require('../config/config');
var Connector = require('./connector');
var Errors = require('./../modules/errors');

var platformParams = {
    client_id: '167545',
    client_secret: '0d586be94448b8322fc9e387c2f05ee0',
    authorizeUrl: 'https://connect.deezer.com/oauth/auth.php',
    getTokenUrl: 'https://connect.deezer.com/oauth/access_token.php',
    authorizations: 'basic_access,email'
};

class Deezer extends Connector {

    get infos () {

        return {
            name: 'Deezer',
            serviceId: 'deezer'
        };
    }

    askLogin(req, res, state) {

        var perms = platformParams.authorizations;
        res.redirect(platformParams.authorizeUrl + '?' +
                     querystring.stringify({
                         app_id: platformParams.client_id,
                         perms: perms,
                         redirect_uri: this.redirectUrl,
                         state: state
                     })
        );
    }

    authCallback(req, res) {

        var self = this;

        if(req.query.error) {
            Errors.sendError(res, 'AUTH_ERROR', req.query.error);
        }
        else if (req.query.code) {

            var code = req.query.code || null;

            var authOptions = {
                url: platformParams.getTokenUrl + '?' +
                    querystring.stringify({
                        app_id: platformParams.client_id,
                        secret: platformParams.client_secret,
                        code: code,
                        output: 'json'
                    }),
                json: true
            };

            request.get(authOptions, function(error, response, body) {

                if (!error && response.statusCode === 200) {

                    var tokens = {
                        access_token: body.access_token,
                        expires: body.expires
                    };

                    req.user.setConnection(self, tokens);

                    var options = {
                        url: 'https://api.deezer.com/user/me' + '?' +
                            querystring.stringify({
                                access_token: tokens.access_token
                            })
                    };

                    // use the access token to access the Spotify Web API
                    request.get(options, function(error, response, body) {
                        console.log(body);
                    });

                    // we can also pass the token to the browser to make requests from there
                    res.redirect('/');
                } else {
                    res.redirect('/#?error=spotifycallback');
                }
            });
        }

    }

    getPlaylists (req, res) {

        var options = {
            url: 'https://api.spotify.com/v1/users/ehpys/playlists',
            headers: { 'Authorization': 'Bearer ' + "" },
            json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
            console.log(body);
            res.json(body);
        });
    }
}

module.exports = Deezer;