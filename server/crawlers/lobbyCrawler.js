var _ = require('lodash');

var Lobby = require('../scmodels/lobby');

// TODO mieux gerer les erreurs, quand s'arreter ?

class LobbyCrawler {
    constructor(soundcloud, cacheWrapper) {
        this.soundCloud = soundcloud;
        this.cacheWrapper = cacheWrapper;
    }

    updateLobby(lobby, callback) {
        var self = this;
        var tracks = [];

        async.each(lobby.artists, function(artistId, artistCallback) {

            self.getLastArtistSongs(artistId, function(err, artistTracks) {

                tracks = tracks.concat(artistTracks);

                artistCallback();
            });
        }, function(err) {
            if(err) return callback(err);

            tracks = self.sortTracks(tracks);

            self.updateLobbyTracks(lobby, tracks, function(updateError) {
                if(updateError) return callback(updateError);

                callback(null);
            });
        });
    }

    updateLobbyTracks(lobby, tracks, callback) {

        User.findById(lobby.sc_id_user, function(err, user) {
            if(err) return callback(err);

            var trackIds = _.map(tracks, 'id');
            this.soundCloud.updatePlaylist(lobby.sc_id_playlist, user, trackIds, function(updateErr) {
                if(updateErr) return callback(updateErr);

                callback(null);
            });
        });
    }

    getLastArtistSongs(artistId, callback) {
        // TODO redis, async
        this.cacheWrapper.get('artist_songs:' + artistId, function(cacheErr, lastSongs) {
            if(cacheErr) return callback(cacheErr);

            if(lastSongs) {
                callback(null, lastSongs);
            }
            else {
                var options = {
                    n: 20,
                    offset: 0
                };

                var lastSCTracks = this.soundCloud.getLastArtistSongs(artistId, options);

                var lastTracks = _.map(lastSCTracks, function(scTrack) {
                    var track = {
                        id: scTrack.id,
                        timestamp: scTrack.timestamp // ???
                    };

                    return track;
                });

                var expiration = 200;

                this.cacheWrapper.set('artist_songs:'+artistId, lastTracks, expiration);

                callback(null, lastSongs);
            }
        });
    }

    sortTracks(tracks) {
        return _.sort(tracks, 'timestamp');
    }

    crawlLobbies(callback) {
        var self = this;
        var limitLobbies = 10;

        Lobby.find({}, function onLobbies(err, lobbies) {
            if(err) return callback(err);

            async.eachLimit(lobbies, limitLobbies, self.updateLobby, function(lobbyErr) {
                if(lobbyErr) return callback(lobbyErr);

                callback(null);
            });
        });
    }
}

module.exports = LobbyCrawler;
