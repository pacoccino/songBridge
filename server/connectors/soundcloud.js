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
            id: 'soundcloud',
            api_url: 'https://api.soundcloud.com/',
            passportId: 'soundcloud'
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
            headers: headers
        };

        if(data) {
            options.json = data;
            // or
            // options.data = JSON.stringify(data);
        }

        this.http(options, function(error, response, body) {
            // TODO catch error (body empty)
            if(error || response.statusCode !== 200) {
                var reqError = {
                    request: options,
                    code: response.statusCode,
                    message: response.statusMessage,
                    body: response.body
                };
                callback(reqError);
            } else {
                try{
                    body = JSON.parse(body);
                }
                catch(e) {
                    Logger.silly('Http response not serialisable')
                }
                callback(null, body);
            }
        });
    }

    newPlaylist(userToken, name, tracks, callback) {
        tracks = tracks || [];

        var request = this.newRequest(userToken);
        request.playlists();
        var reqData = {
            playlist: {
                title: name,
                sharing: 'public',
                tracks: tracks
            }
        };

        request.post(reqData, function(err, playlist) {
            callback(err, playlist);
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
