"use strict";
var request = require('request');

var Config = require('../config/config');
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

    getUserInfo_s(user, callback) {

        var userConnection = user.getConnection(this);

        var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: {'Authorization': 'Bearer ' + userConnection.access_token},
            json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
            callback(null, body);
        });
    };

    ////////////////////////
    // Library

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

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
            callback(null, body);
        });
    };
}

module.exports = Spotify;