var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    auth: [
        {
            provider: String,
            tokens: { auth: String, refresh: String, refreshed: Date}
        }
    ]
});

var User = mongoose.model('User', userSchema);

module.exports = User;