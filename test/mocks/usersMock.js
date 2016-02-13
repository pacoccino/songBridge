module.exports = {
    findByIdData: null,
    findByIdError: null,
    findById: function(id, callback) {
        callback(this.findByIdError, this.findByIdData);
    }
};