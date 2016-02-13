var cacheMock = {
    get: function(name, callback) {
        callback(this.getError, this.getData);
    },
    set: function(name, value, options, callback) {
        callback(this.setError);
    }
};

cacheMock.reset = function() {
    cacheMock.getData = null;
    cacheMock.getError = null;
    cacheMock.setError = null;
};

module.exports = cacheMock;