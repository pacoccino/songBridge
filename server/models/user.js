var _ = require('lodash');

function User() {
    this._id = _.uniqueId();

    this.connections = {};
}

User.prototype.setConnection = function(service, tokens) {

    this.connections[service.infos.serviceId] = tokens;
};

User.prototype.getConnection = function(service) {

    return this.connections[service.infos.serviceId];
};

User.prototype.refreshToken = function(service, access_token) {

    this.connections[service.infos.serviceId].access_token = access_token;
};

User.prototype.unsetConnection = function(service) {

    delete this.connections[service.infos.serviceId];
};


module.exports = User;
