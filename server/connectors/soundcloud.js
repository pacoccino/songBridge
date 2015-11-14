"use strict";
var querystring = require('querystring');
var request = require('request');

var Config = require('../config/config');
var Connector = require('./connector');
var Errors = require('./../modules/errors');

var platformParams = {
    client_id: 'bf005413b19842fbf55e6aac73687ac8',
    client_secret: '5262675c6e05173bd512c542c3ba05bb',
    authorizeUrl: 'https://soundcloud.com/connect',
    getTokenUrl: 'https://api.soundcloud.com/oauth2/token',
    scope: 'non-expiring'
};

class SoundCloud extends Connector {

    get infos () {

        return {
            name: 'SoundCloud',
            serviceId: 'soundcloud'
        };
    }

    askLogin(req, res, state) {

        res.redirect(platformParams.authorizeUrl + '?' +
                     querystring.stringify({
                         client_id: platformParams.client_id,
                         redirect_uri: this.redirectUrl,
                         response_type: 'code',
                         scope: platformParams.scope,
                         display: "",
                         state: state
                     })
        );
    }

    authCallback(req, res) {

        if(req.query.error) {
            Errors.sendError(res, "AUTH_ERROR", req.query.error_description);
            return;
        }

        var code = req.query.code || null;

        var authOptions = {
            url: platformParams.getTokenUrl,
            form: {
                client_id: platformParams.client_id,
                client_secret: platformParams.client_secret,
                code: code,
                redirect_uri: this.redirectUrl,
                grant_type: 'authorization_code'
            },
            json: true
        };

        var self = this;

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {

                var tokens = {
                    access_token: body.access_token
                };

                req.user.setConnection(self, tokens);

                var options = {
                    url: 'https://api.soundcloud.com/me',
                    qs: {oauth_token: tokens.access_token},
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function(error, response, body) {
                    console.log(body);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect('/');
            } else {
                res.redirect('/#/?error=soundcloudcallback');
            }
        });
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

module.exports = SoundCloud;