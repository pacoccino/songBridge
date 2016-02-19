var expect = require('chai').expect;

var User = require('../../../server/models/user');

var user;

describe('User', function() {

    beforeEach(function () {
        user = new User();
    });

    it('creates user', function () {

        expect(user).not.to.be.undefined;
        expect(user._id).not.to.be.undefined;
        expect(user.connections).not.to.be.undefined;
        expect(user.connections.length).to.equal(0);
    });

    it('set/get connection', function () {

        var connectionData = {
            userId: "123",
            tokens: {
                access_token: "a",
                refresh_token: "b",
                timestamp: new Date()
            }
        };

        user.setConnection('serviceId', connectionData);

        var connection = user.getConnection('serviceId');

        expect(connection).not.to.be.null;
        expect(connection._id).to.equal('serviceId');
        expect(connection.userId).to.equal(connectionData.userId);
        expect(connection.tokens.access_token).to.equal(connectionData.tokens.access_token);
        expect(connection.tokens.refresh_token).to.equal(connectionData.tokens.refresh_token);
        expect(connection.tokens.timestamp).to.equal(connectionData.tokens.timestamp);


        connectionData = {
            userId: "456",
            tokens: {
                access_token: "q",
                refresh_token: "s",
                timestamp: new Date()
            }
        };

        user.setConnection('serviceId', connectionData);

        connection = user.getConnection('serviceId');

        expect(connection).not.to.be.null;
        expect(connection._id).to.equal('serviceId');
        expect(connection.userId).to.equal(connectionData.userId);
        expect(connection.tokens.access_token).to.equal(connectionData.tokens.access_token);
        expect(connection.tokens.refresh_token).to.equal(connectionData.tokens.refresh_token);
        expect(connection.tokens.timestamp).to.equal(connectionData.tokens.timestamp);
    });
    it('unset connection', function () {

        user.setConnection('serviceId', {
            userId: "123",
            tokens: {
                access_token: "a",
                refresh_token: "b",
                timestamp: "c"
            }
        });

        user.unsetConnection('serviceId');

        var connection = user.getConnection('serviceId');

        expect(connection).to.be.null;
    });

});