"use strict";
var querystring = require('querystring');
var request = require('request');

var Config = require('../config/config');
var Connector = require('./connector');

var platformParams = {
    client_id: '29301ecd40bc431096167df74fd4937c',
    client_secret: '791f299041f0455c83d95b8854a91bb3',
    authorizeUrl: 'https://accounts.spotify.com/authorize'
};

class Spotify extends Connector {

    get infos () {

        return {
            name: 'Spotify',
            serviceId: 'spotify'
        };
    };

    askLogin(req, res, state) {

        var scope = 'user-read-private user-read-email';
        res.redirect(platformParams.authorizeUrl + '?' +
                     querystring.stringify({
                         response_type: 'code',
                         client_id: platformParams.client_id,
                         scope: scope,
                         redirect_uri: this.redirectUrl,
                         state: state
                     })
        );
    };

    authCallback(req, res) {

        var code = req.query.code || null;

        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: this.redirectUrl,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(platformParams.client_id + ':' + platformParams.client_secret).toString('base64'))
            },
            json: true
        };
        var self = this;

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {

                var tokens = {
                    access_token: body.access_token,
                    refresh_token: body.refresh_token
                };

                req.user.setConnection(self, tokens);

                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + tokens.access_token },
                    json: true
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
    };


    refreshToken(req, res) {

        var self = this;
        var tokens = req.user.getConnection(self, tokens);
        var refresh_token = tokens.refresh_token;

        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: { 'Authorization': 'Basic ' + (new Buffer(platformParams.client_id + ':' + platformParams.client_secret).toString('base64')) },
            form: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {

                var access_token = body.access_token;

                req.user.refreshToken(self, access_token);

                res.send({
                    'access_token': access_token
                });
            }
        });
    };

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
    };
}

module.exports = Spotify;