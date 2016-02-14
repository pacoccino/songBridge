var connectorMock = {
    endRequest: function(request, callback) {
        this.endRequestRequest = request;
        callback();
    }
};

connectorMock.reset = function() {
    connectorMock.endRequestRequest = null;
};

connectorMock.reset();

module.exports = connectorMock;