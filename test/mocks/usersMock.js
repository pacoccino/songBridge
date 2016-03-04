module.exports = {
    findByIdData: null,
    findByIdError: null,
    findById: function(id, callback) {
        callback(this.findByIdError, this.findByIdData);
    },
    findByServiceId: function(id, serviceId, callback) {
        callback(this.findByIdError, this.findByIdData);
    }
};