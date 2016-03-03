var Soundcloud = require('../../../server/connectors/soundcloud');

var soundcloudMock = {
    newRequest: function() {
        var requestObject = {
            users: function() {
                return this;
            },
            playlists: function() {
                return this;
            },
            tracks: function() {
                return this;
            },
            get: function(a, c) {
                c(soundcloudMock.getError, soundcloudMock.getData);
            },
            put: function(d, c) {
                c();
            }
        };

        return requestObject;
    },
    getTimestamp: Soundcloud.getTimestamp
};

soundcloudMock.reset = function() {
    soundcloudMock.getData = null;
    soundcloudMock.getError = null;
};

module.exports = soundcloudMock;