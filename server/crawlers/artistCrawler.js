var async = require('async');

var Artist = require('../scmodels/artist');
var ArtistScrapper = require('./artistScrapper');

class ArtistCrawler {
    constructor(soundcloud) {
        this.soundCloud = soundcloud;
    }

    crawlAllArtists(callback) {
        var self = this;
        var scrapper = new ArtistScrapper(self.soundcloud);
        var limitArtist = 10;
        var limitLobbies = 10;

        Artist.find({}, function onArtists(err, artists) {
            if(err) return callback(err);

            async.eachLimit(artists, limitArtist, forEachArtist);
        });

        function forEachArtist(artist) {
            scrapper.getMissingSounds(artist.sc_id_artist, function onMissingSongs(missingSongs) {
                artist.getLobbies(function onLobbies(artistLobbies) {
                    async.eachLimit(artistLobbies, limitLobbies, function(lobby) {
                        var playlistId = lobby.sc_id_playlist;
                        User.findById(lobby.sc_id_user, function(err, user) {
                            self.soundCloud.addToPlaylistTop(playlistId, user, missingSongs);
                        });
                    });
                });
            });
        }
    }
}

module.exports = ArtistCrawler;
