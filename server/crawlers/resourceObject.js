"use strict";

class ResourceObject {
    constructor(connector, asUser) {
        this.resource = null;
        this.resourceId = null;
        this.subResource = null;
        this.subResourceId = null;
        this.connector = connector;
        this.asUser = asUser;
    }

    requestFull() {
        return (this.resource !== null && this.subResource !== null);
    }

    isResource() {
        return (this.resource !== null && this.subResource === null);
    }
    isSubResource() {
        return (this.resource !== null && this.subResource !== null);
    }

    appendResource(resource, id) {

        if(this.requestFull()) {
            throw "Too much resources asked";
        }

        if(this.resource) {
            this.subResource = resource;
        }
        else {
            this.resource = resource;
        }

        // TODO null ?
        if(this.isResource() && id !== undefined) {
            this.resourceId = id;
        }
        if(this.isSubResource() && id !== undefined) {
            this.subResourceId = id;
        }

        return this;
    }

    users(userId) {
        return this.appendResource("users", userId);
    }

    playlists(playlistId) {
        return this.appendResource("playlists", playlistId);
    }

    tracks(trackId) {
        return this.appendResource("tracks", trackId);
    }
    followings(id) {
        return this.appendResource("followings", id);
    }
    favorites(id) {
        return this.appendResource("favorites", id);
    }

    get(callback) {
        if(!this.isResource() && !this.isSubResource()) {
            throw "Empty get request";
        }
        if (this.resourceId === null) {
            throw "Please specify resource id"
        }
        this.requestType = "GET";

        this.connector.endRequest(this, callback);
    }

    put(data, callback) {
        if(!this.isResource() && !this.isSubResource()) {
            throw "Empty put request";
        }
        if (this.resourceId === null) {
            throw "Please specify resource id"
        }
        this.requestType = "PUT";
        this.requestData = data;

        this.connector.endRequest(this, callback);
    }

    post(data, callback) {
        if(!this.isResource()) {
            throw "Empty post request";
        }
        if(this.isSubResource()) {
            throw "Post on subresource not allowed"
        }
        this.requestType = "POST";
        this.requestData = data;

        this.connector.endRequest(this, callback);
    }

    search(searchObject, callback) {
        if(!this.isResource() && !this.isSubResource()) {
            throw "Empty request";
        }
        this.requestType = "GET";
        this.requestSearch = searchObject;

        this.connector.endRequest(this, callback);
    }
}

module.exports = ResourceObject;