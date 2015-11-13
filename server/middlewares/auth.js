var _ = require('lodash');

var Users = require('../models/users');

var COOKIE_NAME = "songBridge_authid";

var Auth = function() {
    var users = new Users();

    return function (req, res, next) {

        var authId = req.cookies[COOKIE_NAME];
        var user = authId !== undefined ? users.get(req.cookies[COOKIE_NAME]) : null;

        if (user) {

            req.user = user;
        }

        else {
            user = users.create();

            req.user = user;
            res.cookie(COOKIE_NAME, user._id);
        }

        next();
    }
};

module.exports = Auth;