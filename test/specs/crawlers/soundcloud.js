var expect = require('chai').expect;

var Soundcloud = require('../../../server/crawlers/soundcloud')

var httpMock = require('../../mocks/httpMock');

var soundcloud;

var options = {
    client_id: "cid",
    api_url: "api/"
};

// TODO client_id & secret token
// TODO put, post& search
describe('Soundcloud', function() {

    beforeEach(function () {
        soundcloud = new Soundcloud(options, httpMock.get.bind(httpMock));
        httpMock.reset();
    });

    it('get user', function (done) {

        var user = "bob";

        var scReq = soundcloud.newRequest();
        var userId = 123;


        httpMock.getBody = user;

        scReq.users(userId).get(function(err, result) {
            expect(httpMock.getOptions.url).to.equal(options.api_url + "users/" + userId);
            expect(httpMock.getOptions.params.client_id).to.equal(options.client_id);
            expect(httpMock.getOptions.params.secret_token).to.be.undefined;
            expect(err).to.be.null;
            expect(result).to.equal(user);
            done();
        });
    });

    it('get user playlist', function (done) {
        var scReq = soundcloud.newRequest();
        var userId = 123;

        var playlists = "playlists";
        httpMock.getBody = playlists;

        scReq.users(userId).playlists().get(function(err, results) {
            expect(httpMock.getOptions.url).to.equal(options.api_url + "users/" + userId + "/playlists");
            expect(err).to.be.null;
            expect(results).to.equal(playlists);
            done();
        });
    });

    it('put playlist', function (done) {
        var user = {
            sc_id: 123,
            auth: {
                token: "tok"
            }
        };

        var scReq = soundcloud.newRequest(user);
        var playlistId = 123;

        var tracks = [1,2,3];

        scReq.playlists(playlistId).put(tracks, function(err) {
            expect(err).to.be.null;

            expect(httpMock.getOptions.params.client_id).to.be.undefined;
            expect(httpMock.getOptions.params.secret_token).to.equal(user.auth.token);

            expect(httpMock.getOptions.url).to.equal(options.api_url + "playlists/" + playlistId);
            expect(httpMock.getOptions.method).to.equal("PUT");
            expect(httpMock.getOptions.data).to.be.defined;
            expect(httpMock.getOptions.data.length).to.equal(tracks.length);
            expect(httpMock.getOptions.data[0]).to.equal(tracks[0]);
            expect(httpMock.getOptions.data[1]).to.equal(tracks[1]);
            done();
        });
    });
});