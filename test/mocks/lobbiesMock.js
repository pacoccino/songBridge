var lobbiesMock = {
    find: function(search, callback) {
        callback(this.findError, this.findData);
    }
};

lobbiesMock.reset = function() {

    lobbiesMock.findData = null;
    lobbiesMock.findError = null;
};

module.exports = lobbiesMock;

