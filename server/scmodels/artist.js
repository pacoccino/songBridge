var mongoose = require('mongoose');
var lodash = require('lodash');

var artistSchema = mongoose.Schema({
        sc_id_artist: {type: String, index: true},
        lastFetchedSong: String
    },
    {
        strict: true
    }
);

artistSchema.methods = {
    getLobbies: function(callback) {
        callback([]);
    },
    updateLastSong: function(songId, callback) {
        if(typeof songId !== string) {
            return callback("Wrong song id");
        }

        this.lastFetchedSong = songId;
        this.save(callback);
    }
};

var Lobby = mongoose.model('Artist', artistSchema);

module.exports = Lobby;