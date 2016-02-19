var expect = require('chai').expect;

var Users = require('../../../server/models/users')

var users;

describe('Users', function() {

    beforeEach(function () {
        users = new Users();
    });

    it('create user', function () {

        var user = users.create();

        expect(user._id).not.to.be.undefined;
        expect(user.connections).not.to.be.undefined;
        expect(user.connections.length).to.equal(0);
    });

    it('find by id', function () {

        var user = users.create();

        var userId = user._id.toString();

        var foundUser = users.getById(userId);

        expect(foundUser).not.to.be.undefined;
        expect(foundUser._id.toString()).to.equal(userId);
    });

    it('find by serviceId', function () {

        var user = users.create();

        var connectionData = {
            userId: "123",
            tokens: {
                access_token: "a",
                refresh_token: "b",
                timestamp: new Date()
            }
        };

        user.setConnection('serviceId', connectionData);

        var foundUser = users.getById("123", 'serviceId');

        expect(foundUser).not.to.be.undefined;
        expect(foundUser._id.toString()).to.equal(user._id.toString());
    });

});