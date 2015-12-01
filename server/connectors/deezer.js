"use strict";
var querystring = require('querystring');
var request = require('request');

var Config = require('../config/config');
var Connector = require('./connector');
var Errors = require('./../modules/errors');

var platformParams = {
    client_id: '167545',
    client_secret: '0d586be94448b8322fc9e387c2f05ee0'
};
class Deezer extends Connector {

    get infos () {

        return {
            name: 'Deezer',
            serviceId: 'deezer',
            oauthOptions: {
                authorizeUrl: 'https://connect.deezer.com/oauth/auth.php',
                tokenUrl: 'https://connect.deezer.com/oauth/access_token.php',
                scope: 'basic_access,email'
            }
        };
    }

    ////////////////////////
    // Overrided methods

    ////////////////////////
    // OAuth

    getLoginPageParams_s(state) {
        return {
            app_id: platformParams.client_id,
            perms: this.infos.oauthOptions.scope,
            redirect_uri: this.redirectUrl,
            state: state
        };
    }

    getTokenRequest_s(code) {
        var url = this.infos.oauthOptions.tokenUrl;
        url += '?';
        url += querystring.stringify({
            app_id: platformParams.client_id,
            secret: platformParams.client_secret,
            code: code,
            output: 'json'
        });

        return {
            method: "GET",
            url: url,
            json: true
        };
    }

    getConnectionData_s(body) {
        return {
            access_token: body.access_token,
            expires: body.expires
        };
    }

    getUserInfo_s(user, callback) {

        var userConnection = user.getConnection(this);

        var options = {
            url: 'https://api.deezer.com/user/me',
            qs: { access_token: userConnection.access_token },
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

module.exports = Deezer;