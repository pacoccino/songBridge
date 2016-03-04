var Soundcloud = require('../../../server/connectors/soundcloud');
var ResourceObject = require('./resourceObjectMock');

var soundcloudMock = {
    newRequest: function() {
        return new ResourceObject(soundcloudMock.mData);
    },
    constructor: {
        getTimestamp: Soundcloud.getTimestamp
    }
};


soundcloudMock.reset = function() {
    soundcloudMock.mData = {};
};
module.exports = soundcloudMock;