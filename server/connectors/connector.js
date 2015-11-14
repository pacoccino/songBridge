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


    logout(req, res) {

        req.user.unsetConnection(this);
        res.send('Successfully logged out');
    };
}

module.exports = Connector;