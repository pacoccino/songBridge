var mongoose = require('mongoose');
var _ = require('lodash');

var ArtistSchema = mongoose.Schema({
        sc_id_artist: {type: String, index: true},
        lastFetchedSong: String
    },
    {
        strict: true,
        _id: false,
        collection: "Artists_Soundcloud"
    }
);

ArtistSchema.methods = {
    getLobbies: function(callback) {
        // TODO get all lobbies containing this artist
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

module.exports = ArtistSchema;
