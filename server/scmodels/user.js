var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
        sc_id: {type: String, index: true},
        auth: {
            token: String,
            refresh: String,
            timestamp: Number
        }
    },
    {
        strict: true
    }
);

userSchema.methods = {
    updateToken: function(authData, callback) {
        var auth = this.auth;
        auth.token = authData.token;
        this.save(callback);
    }
};

var User = mongoose.model('User', userSchema);

module.exports = User;