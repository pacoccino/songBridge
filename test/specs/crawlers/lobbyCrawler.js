var expect = require('chai').expect;

var LobbyCrawler = require('../../../server/crawlers/lobbyCrawler')

var cacheMock = require('../../mocks/cacheMock');
var usersMock = require('../../mocks/usersMock');
var lobbiesMock = require('../../mocks/lobbiesMock');
var soundcloudMock = require('../../mocks/soundcloud/soundcloudMock');
var trackMock = require('../../mocks/soundcloud/track.json');

// TODO spy on sinon
var lobbyCrawler;
describe.only('LobbyCrawler', function() {

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

        soundcloudMock.getLastArtistSongsData = songs;
        soundcloudMock.getLastArtistSongsError = null;

        lobbyCrawler.getLastArtistSongsNoCache("artistId", function (err, artistSongs) {
            expect(err).to.be.null;
            expect(artistSongs).not.to.be.null;
            expect(artistSongs.length).to.equal(songs.length);
            expect(artistSongs[0].id).to.equal(songs[0].id);
            done();
        });
    });
    it('getLastArtistSongsNoCache with error', function (done) {
        soundcloudMock.getLastArtistSongsData = null;
        soundcloudMock.getLastArtistSongsError = "scerr";

        lobbyCrawler.getLastArtistSongsNoCache("artistId", function (err, artistSongs) {
            expect(err).to.equal(soundcloudMock.getLastArtistSongsError);
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

        soundcloudMock.getLastArtistSongsData = songs;
        soundcloudMock.getLastArtistSongsError = null;

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

        soundcloudMock.getLastArtistSongsData = null;
        soundcloudMock.getLastArtistSongsError = null;

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


    it('updatePlaylistTracks', function (done) {
        var lobby = {
            id_sc_playlist: 1235,
            id_sc_user: 456
        };

        var user = {
            id: 456,
            auth: {
                token: "token"
            }
        };

        var tracks = [1, 2, 3, 4, 5, 6, 7];

        usersMock.findByIdData = user;
        usersMock.findByIdError = null;

        soundcloudMock.updatePlaylistError = null;

        lobbyCrawler.updatePlaylistTracks(lobby, tracks, function (err) {
            expect(err).to.be.null;
            expect(soundcloudMock.updatePlaylistData).not.to.be.null;
            expect(soundcloudMock.updatePlaylistData.trackList.length).to.equal(tracks.length);
            expect(soundcloudMock.updatePlaylistData.trackList[0]).to.equal(tracks[0]);
            expect(soundcloudMock.updatePlaylistData.trackList[1]).to.equal(tracks[1]);
            expect(soundcloudMock.updatePlaylistData.trackList[2]).to.equal(tracks[2]);
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


    it('updateLobby', function (done) {
        var lobby = {
            id_sc_playlist: 1235,
            id_sc_user: 456,
            artists: [
                789
            ]
        };

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

        lobbyCrawler.updateLobby(lobby, function (err) {
            expect(err).to.be.null;
            expect(soundcloudMock.updatePlaylistData).not.to.be.null;
            expect(soundcloudMock.updatePlaylistData.trackList.length).to.equal(songs.length);
            expect(soundcloudMock.updatePlaylistData.trackList[0]).to.equal(songs[0].id);
            done();
        });
    });

    it('crawlLobbies', function (done) {
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