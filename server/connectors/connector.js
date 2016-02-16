"use strict";

var _ = require('lodash');

var ResourceObject = require('./resourceObject');

class SoundCloud {
    constructor(options, http) {
        this.options = options;
        this.http = http;
    }

    newRequest(userToken) {
        return new ResourceObject(this, userToken);
    }

    //@abstract
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

    //@abstract
    static isValidRequest(request) {
        return true:
    }

    //@abstract
    endRequest(request, callback) {
        throw "Not implemented";
    }
}

module.exports = SoundCloud;
