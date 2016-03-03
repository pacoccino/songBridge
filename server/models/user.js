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

var UserSchema = mongoose.Schema(
    {
        connections: [connectionSchema]
    },
    {
        strict: true,
        collection: "Users_Generic"
    }
);

UserSchema.methods = {
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

UserSchema.statics = {
    findByServiceId: function(serviceId, userId, callback) {
        this.findOne({
            "connections._id": serviceId,
            "connections.userId": userId
        }, callback);
    }
};

module.exports = UserSchema;
