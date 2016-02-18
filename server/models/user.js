var _ = require('lodash');
var mongoose = require('mongoose');

var connectionSchema = mongoose.Schema(
    {
        serviceId: {type: String, index: true},
        userId: String,
        tokens: {
            access_token: String,
            refresh_token: String,
            timestamp: Date
        }
    },
    {_id: false}
);

var userSchema = mongoose.Schema(
    {
        connections: [connectionSchema]
    },
    {
        strict: true
    }
);

userSchema.methods = {
    setConnection: function(service, tokens) {

        this.connections[service.infos.serviceId] = tokens;
    },
    getConnection: function(service) {

        if(!service) return null;

        return this.connections[service.infos.serviceId];
    },
    refreshToken: function(service, access_token) {

        this.connections[service.infos.serviceId].access_token = access_token;
    },
    unsetConnection: function(service) {

        delete this.connections[service.infos.serviceId];
    }
};

var User = mongoose.model('User', userSchema);


module.exports = User;
