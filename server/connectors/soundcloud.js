"use strict";

var _ = require('lodash');

var Connector = require('./connector');

// TODO
// compact representation
// resolver

class SoundCloud extends Connector {

    constructor(options, http) {
        super(options, http)
    }

    get config () {

        return {
            api_url: 'https://api.soundcloud.com/'
        };
    }

    static isPrivateRequest(requestData) {
        if(requestData.resource === "me") return true;

        return (requestData.requestType !== "GET");
    }

    static isValidRequest(request) {
        if(request.resource === "users" || request.resource === "me") {
            if(request.resource !== "me" && !request.resourceId) {
                return false;
            }
            if(!request.subResource) {
                return true;
            }
            if(request.subResource === "playlists") {
                return true;
            }
            if(request.subResource === "tracks") {
                return true;
            }
            if(request.subResource === "favorites") {
                return true;
            }
            if(request.subResource === "followings") {
                return true;
            }
        }
        if(request.resource === "playlists") {
            if(request.subResource) {
                return false;
            }
            return true;
        }
        if(request.resource === "tracks") {
            if(request.subResource) {
                return false;
            }
            return true;
        }
        return false;
    }

    //@override
    endRequest(request, callback) {
        if(!SoundCloud.isValidRequest(request)) {
            throw "Not valid request";
        }
        var url = this.buildApiUrl(request);

        var params = {};
        if(SoundCloud.isPrivateRequest(request)) {
            params.secret_token = request.userToken;
        }
        else {
            params.client_id = this.options.client_id;
        }

        var data = null;
        if(request.requestData) {
            data = request.requestData;
        }

        var options = {
            url: url,
            method: request.requestType,
            qs: params,
            body: data
        };

        this.http(options, function(error, response, body) {
            // TODO catch error (body empty)
            callback(error, body);
        });
    }

    addToPlaylist(playlistId, user, tracks, callback) {
        // TODO unshift

        var self = this;
        var getRequest = self.newRequest();
        getRequest.playlists(playlistId).get(function(err, playlist) {
            if(err) return callback(err);

            var playlistTracks = _.map(playlist.tracks, 'id');
            var newPlaylistTracks = playlistTracks.concat(tracks);
            newPlaylistTracks = _.map(newPlaylistTracks, function(trackId) {
                return {id: trackId}
            });

            var putData = {
                tracks: newPlaylistTracks
            };
            var putRequest = self.newRequest(user);
            putRequest.playlists(playlistId).put(putData, function(putErr) {
                callback(putErr);
            });

        })
    }
}

module.exports = SoundCloud;
