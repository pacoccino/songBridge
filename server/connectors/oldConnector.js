"use strict";
var request = require('request');
var querystring = require('querystring');

var Config = require('../modules/config');
var Errors = require('./../modules/errors');

/**
 * Service connector base abstract class
 *
 * This class is not intended to be instanciated,
 * as most of methods are not really implemented here,
 * but there are not abstract classes in ES6
 */
class Connector {

    constructor() {
        /*if(new.target.name === "Connector") // On the edge ^_^
            throw "Connector shouldnt be instanciated (abstract)";
            */
    }

    get infos () {

        return {
            name: 'undefined',
            serviceId: 'undefined',
            oauthOptions: {}
        };
    };

    get redirectUrl () {

        var redirect_uri = Config.host + '/api/auth/callback?serviceId=' + this.infos.serviceId;
        return redirect_uri;
    };


    askLogin(req, res, state) {

        var url = this.infos.oauthOptions.authorizeUrl;
        var getParams = this.getLoginPageParams_s(state);

        res.redirect(url + '?' + querystring.stringify(getParams));
    };

    authCallback(req, res) {

        if(req.query.error) {
            Errors.sendError(res, "AUTH_ERROR", req.query.error_description);
            return;
        }

        var self = this;
        var code = req.query.code || null;

        var requestObject = this.getTokenRequest_s(code);

        request(requestObject, function(error, response, body) {
            if (!error && response.statusCode === 200) {

                var connectionData = self.getConnectionData_s(body);

                req.user.setConnection(self, connectionData);

                self.getUserInfo_s(req.user, function(userInfo) {
                    req.user.setUserInfo(self, body);
                });

                res.redirect('/');
            } else {

            }
        });
    };

    logout(user, cb) {

        user.unsetConnection(this);
        cb(null);
    };


    getPlaylistList (user, cb) {

        this.getPlaylistList_s(user, function(err, playlists_s) {
            cb(err, playlists_s);
        })
    };

    /////////////////////////////////////////////////
    // Abstract methods to override

    getLoginPageParams_s() {}
    getTokenRequest_s() {}
    getConnectionData_s() {}
    getUserInfo_s() {}
    playlistListConverter_s() {}
    getPlaylistList_s() {}
}

module.exports = Connector;