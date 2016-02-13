"use strict";

var _ = require('lodash');
var async = require('async');

// TODO mieux gerer les erreurs, quand s'arreter ?

class LobbyCrawler {
    constructor(soundcloud, cache, users, lobbies) {
        this.soundcloud = soundcloud;
        this.cache = cache;
        this.users = users;
        this.lobbies = lobbies;
    }

    updateLobby(lobby, callback) {
        var self = this;
        var tracks = [];

        async.each(lobby.artists, function(artistId, artistCallback) {

            self.getLastArtistSongs(artistId, function(err, artistTracks) {

                if(err) return callback(err);

                tracks = tracks.concat(artistTracks);

                artistCallback();
            });
        }, function(err) {
            if(err) return callback(err);

            tracks = self.sortTracks(tracks);

            var trackIds = _.map(tracks, 'id');

            self.updatePlaylistTracks(lobby, trackIds, function(updateError) {
                if(updateError) return callback(updateError);

                callback(null);
            });
        });
    }

    updatePlaylistTracks(lobby, tracks, callback) {
        var self = this;

        self.users.findById(lobby.sc_id_user, function(err, user) {
            if(err) return callback(err);

            self.soundcloud.updatePlaylist(lobby.sc_id_playlist, user, tracks, function(updateErr) {
                if(updateErr) return callback(updateErr);

                callback(null);
            });
        });
    }

    getLastArtistSongsNoCache(artistId, callback) {
        var self = this;
        var options = {
            n: 20,
            offset: 0
        };

        self.soundcloud.getLastArtistSongs(artistId, options, function(err, lastSCTracks) {
            if(err) return callback(err);

            var lastTracks = _.map(lastSCTracks, function(scTrack) {
                var track = {
                    id: scTrack.id
                };

                track.timestamp = self.soundcloud.getTimestamp(scTrack);

                return track;
            });

            callback(null, lastTracks);
        });
    }

    getLastArtistSongs(artistId, callback) {
        var self = this;
        // TODO redis, async
        self.cache.get('artist_songs:' + artistId, function(cacheErr, lastSongs) {
            if(cacheErr) return callback(cacheErr);

            if(lastSongs) {
                callback(null, lastSongs);
            }
            else {
                self.getLastArtistSongsNoCache(artistId, function(getError, fetchedTracks) {
                    if(getError) return callback(getError);

                    var options = {
                        expiration: 180 // 3 minutes
                    };

                    self.cache.set('artist_songs:'+artistId, fetchedTracks, options, function(setCacheErr) {
                        if(setCacheErr) return callback(setCacheErr);

                        callback(null, fetchedTracks);
                    });
                });
            }
        });
    }

    sortTracks(tracks) {
        return _.sortBy(tracks, 'timestamp');
    }

    crawlLobbies(callback) {
        var self = this;
        var limitLobbies = 10;

        this.lobbies.find({}, function onLobbies(err, lobbies) {
            if(err) return callback(err);

            async.eachLimit(lobbies, limitLobbies, self.updateLobby.bind(self), function(lobbyErr) {
                if(lobbyErr) return callback(lobbyErr);

                callback(null);
            });
        });
    }
}

module.exports = LobbyCrawler;
