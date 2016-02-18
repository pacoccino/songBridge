var mongoose = require('mongoose');
var _ = require('lodash');

var lobbySchema = mongoose.Schema({
        sc_id_playlist: {type: String, index: true},
        sc_id_user: String,
        name: String,
        artists: [String]
    },
    {
        strict: true,
        _id: false
    }
);

lobbySchema.statics = {
    list: function(userId, callback, options) {
        options = options || {};
        options = _.assign(options, {
            n: 10,
            cache: false
        });

        var search = {
            sc_id_user: userId
        };

        this.find(search)
            .limit(options.n)
            .cache(options.cache)
            .exec(callback);
    }
};

lobbySchema.methods = {
    addArtist: function(artistId, callback) {
        if(typeof artistId !== string) {
            return callback("Wrong artist id");
        }

        var artists = this.artists;
        artists.push(artistId);

        this.save(callback);
    },
    removeArtist: function(artistId, callback) {
        if(typeof artistId !== string) {
            return callback("Wrong artist id");
        }

        var artists = this.artists;
        var artistIndex = _.findIndex(artists, artistId);

        if(artistIndex !== -1) {
            artists.splice(artistIndex, 1);
            this.save(callback);
        } else {
            callback(null);
        }
    }
};

var Lobby = mongoose.model('Lobby', lobbySchema);

module.exports = Lobby;
