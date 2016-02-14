/**
 * Created by paco on 14/02/16.
 */
var expect = require('chai').expect;

var ResourceObject = require('../../../server/crawlers/resourceObject')
var connectorMock = require('../../mocks/connectorMock');

var resourceObject;

describe('ResourceObject', function() {

    beforeEach(function () {
        resourceObject = new ResourceObject(connectorMock);
    });

    it('get user', function (done) {
        resourceObject.users(1).get(function() {
            expect(connectorMock.endRequestRequest.resource).to.equal("users");
            expect(connectorMock.endRequestRequest.resourceId).to.equal(1);
            expect(connectorMock.endRequestRequest.requestType).to.equal("GET");
            done();
        });
    });
    it('get user playlist', function (done) {
        resourceObject.users(1).playlists().get(function() {
            expect(connectorMock.endRequestRequest.resource).to.equal("users");
            expect(connectorMock.endRequestRequest.subResource).to.equal("playlists");
            expect(connectorMock.endRequestRequest.resourceId).to.equal(1);
            expect(connectorMock.endRequestRequest.requestType).to.equal("GET");
            done();
        });
    });

    it('get if user favorites a track', function (done) {
        resourceObject.users(1).favorites(2).get(function() {
            expect(connectorMock.endRequestRequest.resource).to.equal("users");
            expect(connectorMock.endRequestRequest.subResource).to.equal("favorites");
            expect(connectorMock.endRequestRequest.resourceId).to.equal(1);
            expect(connectorMock.endRequestRequest.subResourceId).to.equal(2);
            expect(connectorMock.endRequestRequest.requestType).to.equal("GET");
            done();
        });
    });

    it('append endpoint', function () {
        resourceObject.appendResource("a", 1);
        expect(resourceObject.resource).to.equal("a");
        expect(resourceObject.resourceId).to.equal(1);
        expect(resourceObject.subResource).to.equal(null);
        expect(resourceObject.subResourceId).to.equal(null);
        resourceObject.appendResource("b", 2);
        expect(resourceObject.resource).to.equal("a");
        expect(resourceObject.resourceId).to.equal(1);
        expect(resourceObject.subResource).to.equal("b");
        expect(resourceObject.subResourceId).to.equal(2);
    });
});