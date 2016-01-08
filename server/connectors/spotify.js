"use strict";
var request = require('request');

var Config = require('../modules/config');
var Connector = require('./connector');

var platformParams = {
    client_id: '29301ecd40bc431096167df74fd4937c',
    client_secret: '791f299041f0455c83d95b8854a91bb3'
};

class Spotify extends Connector {

    get infos () {

        return {
            name: 'Spotify',
            serviceId: 'spotify',
            oauthOptions: {
                authorizeUrl: 'https://accounts.spotify.com/authorize',
                tokenUrl: 'https://accounts.spotify.com/api/token',
                scope: 'user-read-private user-read-email'
            }
        };
    };

    ////////////////////////
    // Overrided methods

    ////////////////////////
    // OAuth

    getLoginPageParams_s(state) {
        return {
            response_type: 'code',
            client_id: platformParams.client_id,
            scope: this.infos.oauthOptions.scope,
            redirect_uri: this.redirectUrl,
            state: state
        };
    }

    getTokenRequest_s(code) {
        return {
            method: "POST",
            url: this.infos.oauthOptions.tokenUrl,
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
    }

    getConnectionData_s(body) {
        return {
            access_token: body.access_token,
            refresh_token: body.refresh_token
        };
    }

    refreshToken(req, res) {

        var self = this;
        var tokens = req.user.getConnection(self);
        var refresh_token = tokens.refresh_token;

        var authOptions = {
            url: this.infos.oauthOptions.tokenUrl,
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

    ////////////////////////
    // Library

    getUserInfo_s(user, callback) {

        var userConnection = user.getConnection(this);

        var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: {'Authorization': 'Bearer ' + userConnection.access_token},
            json: true
        };

        request.get(options, function(error, response, body) {
            callback(null, body);
        });
    };

    playlistListConverter_s(playlists) {
        return playlists;
    }

    getPlaylistList_s (user, callback) {

        var userConnection = user.getConnection(this);

        var options = {
            url: 'https://api.spotify.com/v1/users/ehpys/playlists',
            headers: { 'Authorization': 'Bearer ' + userConnection.access_token },
            json: true
        };

        request.get(options, function(error, response, body) {
            if(error) {
                return callback(error);
            }
            var playlists_s = body.items;
            var playlists = [];
            playlists_s.forEach(function(playlist) {
                playlists.push({
                    id: playlist.id,
                    name: playlist.name
                });
            });

            callback(null, playlists);
        });
    };
}

module.exports = Spotify;