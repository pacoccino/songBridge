"use strict";

var _ = require('lodash');
var async = require('async');

var Logger = require('../modules/logger');

// TODO mieux gerer les erreurs, quand s'arreter ?

class LobbyCrawler {
    constructor(soundcloud, cache, users, lobbies) {
        this.soundcloud = soundcloud;
        this.cache = cache;
        this.users = users;
        this.lobbies = lobbies;
    }

    /**
     * @private
     * @param lobby
     * @param callback
     */
    updateLobby(lobby, callback) {
        var self = this;
        var tracks = [];

        async.each(lobby.artists, function(artistId, artistCallback) {


            self.getLastArtistSongs(artistId, function(err, artistTracks) {

                Logger.silly("artist " +artistId+": " + artistTracks.length + " songs");

                if(err) return callback(err);

                tracks = tracks.concat(artistTracks);

                artistCallback();
            });
        }, function(err) {
            if(err) return callback(err);

            tracks = self.sortTracks(tracks);

            var trackIds = _.map(tracks, 'id');

            self.getLobbyUser(lobby, function(userError, user) {
                if(userError) return callback(userError);

                Logger.silly("user: " + user.toString());

                self.updatePlaylistTracks(lobby.sc_id_playlist, user, trackIds, function(updateCb) {
                    if(updateCb) return callback(updateCb);
                    callback(null);
                });
            });
        });
    }

    /**
     * @private
     * @param lobby
     * @param tracks
     * @param callback
     */
    getLobbyUser(lobby, callback) {
        var self = this;

        self.users.findByServiceId("soundcloud", lobby.sc_id_user, function(err, user) {
            if(err) return callback(err);

            callback(null, user);
        });
    }

    /**
     * @private
     * @param callback
     * @param playlistId
     * @param user
     * @param trackIds
     */
    updatePlaylistTracks(playlistId, user, trackIds, callback) {
        var self = this;
        Logger.silly("preparing to update...");

        var scConnection = user.getConnection("soundcloud");
        var userToken = scConnection.tokens.access_token;

        var request = self.soundcloud.newRequest(userToken);

        var tracks = _.map( trackIds, (trackId) => {return {id: trackId};} );

        request.users(scConnection.userId).playlists(playlistId).put(tracks, callback);
    }

    /**
     * @private
     * @param artistId
     * @param callback
     */
    getLastArtistSongsNoCache(artistId, callback) {
        var self = this;
        var options = {
            n: 20,
            offset: 0
        };

        var request = self.soundcloud.newRequest();
        request.users(artistId).tracks().get(options, onTracks);

        function onTracks(err, lastSCTracks) {
            if(err) return callback(err);

            var lastTracks = _.map(lastSCTracks, function(scTrack) {
                var track = {
                    id: scTrack.id
                };

                console.log(scTrack)
                console.log(track)
                track.timestamp = self.soundcloud.constructor.getTimestamp(scTrack);

                return track;
            });

            callback(null, lastTracks);
        }
    }

    /**
     * @private
     * @param artistId
     * @param callback
     */
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

    /**
     * Sort tracks by timestamp
     * @private
     * @param tracks
     * @returns {Array}
     */
    sortTracks(tracks) {
        return _.sortBy(tracks, 'timestamp');
    }

    /**
     * Crawl every lobbies, fetch associated artists update playlist songs
     * @param callback
     */
    crawlLobbies(callback) {
        Logger.silly("Crawling lobbies");

        var self = this;
        var limitLobbies = 10;

        this.lobbies.find({}, function onLobbies(err, lobbies) {
            if(err) return callback(err);

            Logger.silly(lobbies.length + " lobbies to crawl");

            async.eachLimit(lobbies, limitLobbies, self.updateLobby.bind(self), function(lobbyErr) {
                if(lobbyErr) return callback(lobbyErr);

                callback(null);
            });
        });
    }
}

module.exports = LobbyCrawler;
