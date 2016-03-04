"use strict";

var _ = require('lodash');

var Connector = require('./connector');
var Logger = require('../modules/logger');

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
        if(SoundCloud.isPrivateRequest(request) && !request.userToken) {
            return false;
        }

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

    // TODO
    static getTimestamp(track) {
        return 12;
    }

    getRequestData(request) {
        var data = null;
        if(!request.requestData) {
            return data;
        }
        if(request.subResource === "playlists") {
            data = {
                playlist: {
                    tracks: request.requestData
                }
            };
        }
        return data;
    }

    //@override
    endRequest(request, callback) {
        if(!SoundCloud.isValidRequest(request)) {
            throw "Not valid request";
        }
        var url = this.buildApiUrl(request);

        var params = {};
        params.client_id = this.options.client_id;

        var headers = {
            "Content-Type": "application/json"
        };
        if(SoundCloud.isPrivateRequest(request)) {
            headers.Authorization = "OAuth " + request.userToken;
        }

        var data = this.getRequestData(request);

        var options = {
            url: url,
            method: request.requestType,
            qs: params,
            body: JSON.stringify(data),
            headers: headers,
            json: true
        };

        Logger.info(options);
        this.http(options, function(error, response, body) {
            // TODO catch error (body empty)
            if(!error) {
                try{
                    body = JSON.parse(body);
                }
                catch(e) {
                    Logger.silly('Http response not serialisable')
                }
            }
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
