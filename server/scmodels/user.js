var mongoose = require('mongoose');

var soundcloudUserSchema = mongoose.Schema({
        sc_id: {type: String, index: true},
        access_token: String
    },
    {
        strict: true,
        _id: false
    }
);

soundcloudUserSchema.methods = {
    updateToken: function(authData, callback) {
        var auth = this.auth;
        auth.token = authData.token;
        this.save(callback);
    }
};

var SoundCloudUser = mongoose.model('User', soundcloudUserSchema);

module.exports = SoundCloudUser;
