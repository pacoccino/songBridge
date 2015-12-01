var _ = require('lodash');
var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectId;

function User() {
    this._id = new ObjectId().toString();

    this.connections = {};
    this.userInfos = {};
}

User.prototype.setConnection = function(service, tokens) {

    this.connections[service.infos.serviceId] = tokens;
};

User.prototype.getConnection = function(service) {

    return this.connections[service.infos.serviceId];
};

User.prototype.setUserInfo = function(service, infos) {

    this.userInfos[service.infos.serviceId] = infos;
};

User.prototype.getUserInfo = function(service) {

    return this.userInfos[service.infos.serviceId];
};

User.prototype.refreshToken = function(service, access_token) {

    this.connections[service.infos.serviceId].access_token = access_token;
};

User.prototype.unsetConnection = function(service) {

    delete this.connections[service.infos.serviceId];
};


module.exports = User;
