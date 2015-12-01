"use strict";

var Config = require('../config/config');

class Connector {

    constructor() {


    }

    get infos () {

        return {
            name: 'undefined',
            serviceId: 'undefined'
        };
    };

    get redirectUrl () {

        var redirect_uri = Config.host + '/api/auth/callback?serviceId=' + this.infos.serviceId;
        return redirect_uri;
    };


    logout(user, cb) {

        user.unsetConnection(this);
        cb(null);
    };

    // @ToOverride
    getPlaylists_s() {
        return [];
    }

    // @ToOverride
    playlistConverter_s(playlist) {
        return playlist;
    }

    getPlaylists (user, cb) {

        this.getPlaylists_s(user, function(err, playlists_s) {
            cb(err, playlists_s);
        })
    };
}

module.exports = Connector;