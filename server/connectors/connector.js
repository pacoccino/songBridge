"use strict";

var _ = require('lodash');

var ResourceObject = require('./resourceObject');

class Connector {

    constructor(options, http) {
        if(new.target.name === "Connector") // On the edge ^_^
            throw "Connector shouldnt be instanciated (abstract)";

        this.options = options;
        this.http = http;
    }

    newRequest(userToken) {
        return new ResourceObject(this, userToken);
    }

    //@abstract
    endRequest(request, callback) {
        throw "Not implemented";
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
}

module.exports = Connector;
