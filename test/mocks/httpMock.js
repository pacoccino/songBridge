var httpMock = {
    get: function(options, callback) {
        this.getOptions = options;
        callback(this.getError, this.getResponse, this.getBody);
    }
};

httpMock.reset = function() {
    httpMock.getOptions = null;
    httpMock.getError = null;
    httpMock.getResponse = null;
    httpMock.getBody = null;
};

httpMock.reset();

module.exports = httpMock;