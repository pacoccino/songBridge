"use strict";

var _ = require('lodash');

var Config = require('../modules/config');

var ResourceObject = require('./resourceObject');

// TODO
// compact representation
// resolver

class SoundCloud {
    constructor(options, http) {
        this.options = options;
        this.http = http;
    }

    newRequest(user) {
        return new ResourceObject(this, user);
    }

    static isPrivateRequest(requestData) {
        if(requestData.resource === "me") return true;

        return (requestData.requestType !== "GET");
    }

    buildApiUrl(requestData) {

        var url = this.options.api_url;
        url += requestData.resource;

        if(requestData.resourceId) {
            url += "/";
            url += requestData.resourceId;

            if (requestData.subResource) {
                url += "/";
                url += requestData.subResource;

                if (requestData.subResourceId) {
                    url += "/";
                    url += requestData.subResourceId;
                }
            }
        }
        return url;
    }

    static isValidRequest(request) {
        if(request.resource === "users") {
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

    endRequest(request, callback) {
        if(!SoundCloud.isValidRequest(request)) {
            throw "Not valid request";
        }
        var url = this.buildApiUrl(request);

        var params = {};
        if(SoundCloud.isPrivateRequest(request)) {
            var token = request.asUser.auth.token;
            params.secret_token = token;
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
            params: params,
            data: data
        };

        // todo post
        this.http(options, function(error, response, body) {
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
