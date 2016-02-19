var _ = require('lodash');
var mongoose = require('mongoose');

var connectionSchema = mongoose.Schema(
    {
        _id: String,
        userId: String,
        tokens: {
            access_token: String,
            refresh_token: String,
            timestamp: Date
        }
    },
    {
        strict: true
    }
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
    setConnection: function(serviceId, connection) {
        var connectionToSet = {
            _id: serviceId,
            userId: connection.userId,
            tokens: {
                access_token: connection.tokens.access_token,
                refresh_token: connection.tokens.refresh_token,
                timestamp: connection.tokens.timestamp
            }
        };

        var existingConnection = this.connections.id(serviceId);
        if(existingConnection) {
            existingConnection.remove();
        }
        this.connections.push(connectionToSet);
    },
    getConnection: function(serviceId) {

        if(!serviceId) return null;

        var existingConnection = this.connections.id(serviceId);

        if(existingConnection) {
            return existingConnection
        }
        else {
            return null
        }
    },
    unsetConnection: function(serviceId) {

        var existingConnection = this.connections.id(serviceId);
        if(existingConnection) {
            existingConnection.remove();
        }
    }
};

var User = mongoose.model('User', userSchema);


module.exports = User;
