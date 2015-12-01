"use strict";
var querystring = require('querystring');
var request = require('request');

var Config = require('../config/config');
var Connector = require('./connector');
var Errors = require('./../modules/errors');

var platformParams = {
    client_id: 'bf005413b19842fbf55e6aac73687ac8',
    client_secret: '5262675c6e05173bd512c542c3ba05bb'
};

class SoundCloud extends Connector {

    get infos () {

        return {
            name: 'SoundCloud',
            serviceId: 'soundcloud',
            oauthOptions: {
                authorizeUrl: 'https://soundcloud.com/connect',
                tokenUrl: 'https://api.soundcloud.com/oauth2/token',
                scope: 'non-expiring'
            }
        };
    }

    ////////////////////////
    // Overrided methods

    ////////////////////////
    // OAuth

    getLoginPageParams_s(state) {
        return {
            client_id: platformParams.client_id,
            redirect_uri: this.redirectUrl,
            response_type: 'code',
            scope: this.infos.oauthOptions.scope,
            display: "",
            state: state
        };
    }

    getTokenRequest_s(code) {
        return {
            method: "POST",
            url: this.infos.oauthOptions.tokenUrl,
            form: {
                client_id: platformParams.client_id,
                client_secret: platformParams.client_secret,
                code: code,
                redirect_uri: this.redirectUrl,
                grant_type: 'authorization_code'
            },
            json: true
        };
    }

    getConnectionData_s(body) {
        return {
            access_token: body.access_token
        };
    }

    getUserInfo_s(user, callback) {

        var userConnection = user.getConnection(this);

        var options = {
            url: 'https://api.soundcloud.com/me',
            qs: { oauth_token: userConnection.access_token },
            json: true
        };

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

        request.get(options, function(error, response, body) {
            callback(null, body);
        });
    };
}

module.exports = SoundCloud;