var expect = require('chai').expect;
var mongoose = require('mongoose');

var User = require('../../../server/models/user');

var LobbyCrawler = require('../../../server/crawlers/lobbyCrawler')

var cacheMock = require('../../mocks/cacheMock');
var usersMock = require('../../mocks/usersMock');
var lobbiesMock = require('../../mocks/lobbiesMock');
var soundcloudMock = require('../../mocks/soundcloud/soundcloudMock');
var trackMock = require('../../mocks/soundcloud/track.json');

var UserModel = mongoose.model('User', User);

// TODO spy on sinon
var lobbyCrawler;
describe('LobbyCrawler', function() {

    beforeEach(function () {
        lobbyCrawler = new LobbyCrawler(soundcloudMock, cacheMock, usersMock, lobbiesMock);
        cacheMock.reset();
        soundcloudMock.reset();
        lobbiesMock.reset();
    });

    it('getLastArtistSongsNoCache without errors', function (done) {
        var songs = [
            trackMock
        ];

        soundcloudMock.mData.getData = songs;
        soundcloudMock.mData.getError = null;

        lobbyCrawler.getLastArtistSongsNoCache("artistId", function (err, artistSongs) {
            expect(err).to.be.null;
            expect(artistSongs).not.to.be.null;
            expect(artistSongs.length).to.equal(songs.length);
            expect(artistSongs[0].id).to.equal(songs[0].id);
            done();
        });
    });
    it('getLastArtistSongsNoCache with error', function (done) {
        soundcloudMock.mData.getData = null;
        soundcloudMock.mData.getError = "scerr";

        lobbyCrawler.getLastArtistSongsNoCache("artistId", function (err, artistSongs) {
            expect(err).to.equal(soundcloudMock.mData.getError);
            expect(artistSongs).to.be.undefined;
            done();
        });
    });


    it('getLastArtistSongs without cache&errors', function (done) {
        var songs = [
            trackMock
        ];

        cacheMock.getData = null;
        cacheMock.getError = null;

        soundcloudMock.mData.getData = songs;
        soundcloudMock.mData.getError = null;

        lobbyCrawler.getLastArtistSongs("artistId", function (err, artistSongs) {
            expect(err).to.be.null;
            expect(artistSongs).not.to.be.null;
            expect(artistSongs.length).to.equal(songs.length);
            expect(artistSongs[0].id).to.equal(songs[0].id);
            done();
        });
    });

    it('getLastArtistSongs with cache', function (done) {
        var songs = [
            trackMock
        ];

        cacheMock.getData = songs;
        cacheMock.getError = null;

        soundcloudMock.mData.getData = null;
        soundcloudMock.mData.getError = null;

        lobbyCrawler.getLastArtistSongs("artistId", function (err, artistSongs) {
            expect(err).to.be.null;
            expect(artistSongs).not.to.be.null;
            expect(artistSongs.length).to.equal(songs.length);
            expect(artistSongs[0].id).to.equal(songs[0].id);
            done();
        });
    });

    it('getLastArtistSongs with cache error', function (done) {
        cacheMock.getData = null;
        cacheMock.getError = "cacheerror";

        lobbyCrawler.getLastArtistSongs("artistId", function (err, artistSongs) {
            expect(err).to.equal(cacheMock.getError);
            expect(artistSongs).to.be.undefined;
            done();
        });
    });

    it('sorttracks', function () {
        var tracks = [
            {
                id: 1,
                timestamp: 12
            },
            {
                id: 2,
                timestamp: 5
            }
        ];
        var sortedTracks = lobbyCrawler.sortTracks(tracks);
        expect(sortedTracks[0].id).to.equal(2);
        expect(sortedTracks[1].id).to.equal(1);
    });


    it('getLobbyUser', function (done) {
        var lobby = {
            id_sc_playlist: 1235,
            id_sc_user: 456,
            artists: [
                789
            ]
        };

        var muser = {
            id: 456,
            auth: {
                token: "token"
            }
        };

        usersMock.findByIdData = muser;
        usersMock.findByIdError = null;

        lobbyCrawler.getLobbyUser(lobby, function (err, user) {
            expect(err).to.be.null;
            expect(user).not.to.be.undefined;
            expect(user.id).to.equal(user.id);
            done();
        });
    });

    it('updatePlaylistTracks', function (done) {
        var playlistId = 123;
        var lobby = {
            id_sc_playlist: 1235,
            id_sc_user: 456,
            artists: [
                789
            ]
        };

        var user =  new UserModel({
            id: 456,
            connections: [
                {
                    _id: "soundcloud",
                    userId: 123,
                    tokens: {
                        access_token: "at",
                        refresh_token: "",
                        timestamp: new Date()
                    }
                }
            ]
        });

        var trackIds = [0,1,2];


        soundcloudMock.mData.getData = null;
        soundcloudMock.mData.getError = null;

        lobbyCrawler.updatePlaylistTracks(playlistId, user, trackIds, function (err) {
            expect(err).not.to.exist;
            expect(soundcloudMock.mData.putData).to.exist;
            expect(soundcloudMock.mData.putData.length).to.equal(trackIds.length);
            console.log(soundcloudMock.mData.putData);
            expect(soundcloudMock.mData.putData[0].id).to.equal(trackIds[0]);
            expect(soundcloudMock.mData.putData[1].id).to.equal(trackIds[1]);

            done();
        });
    });

    xit('updateLobby', function (done) {
        var lobby = {
            id_sc_playlist: 1235,
            id_sc_user: 456,
            artists: [
                789
            ]
        };

        var user =  new UserModel({
            id: 456,
            connections: [
                {
                    _id: "soundcloud",
                    userId: 456,
                    tokens: {
                        access_token: "at",
                        refresh_token: "",
                        timestamp: new Date()
                    }
                }
            ]
        });

        var songs = [
            trackMock
        ];

        usersMock.findByIdData = user;
        usersMock.findByIdError = null;

        cacheMock.getData = songs;
        cacheMock.getError = null;

        lobbyCrawler.updateLobby(lobby, function (err) {
            expect(err).to.be.null;
            expect(soundcloudMock.updatePlaylistData).not.to.be.null;
            expect(soundcloudMock.updatePlaylistData.trackList.length).to.equal(songs.length);
            expect(soundcloudMock.updatePlaylistData.trackList[0]).to.equal(songs[0].id);
            done();
        });
    });

    xit('crawlLobbies', function (done) {
        var lobbies = [
            {
                id_sc_playlist: 1235,
                id_sc_user: 456,
                artists: [
                    789
                ]
            }
        ];

        var user = {
            id: 456,
            auth: {
                token: "token"
            }
        };

        var songs = [
            trackMock
        ];

        usersMock.findByIdData = user;
        usersMock.findByIdError = null;

        cacheMock.getData = songs;
        cacheMock.getError = null;

        lobbiesMock.findData = lobbies;

        lobbyCrawler.crawlLobbies(function (err) {
            expect(err).to.be.null;
            expect(soundcloudMock.updatePlaylistData).not.to.be.null;
            expect(soundcloudMock.updatePlaylistData.trackList.length).to.equal(songs.length);
            expect(soundcloudMock.updatePlaylistData.trackList[0]).to.equal(songs[0].id);
            done();
        });
    });
});