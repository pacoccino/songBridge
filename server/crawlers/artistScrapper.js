var _ = require('lodash');

var Artist = require('../scmodels/artist');

class ArtistScrapper {
    constructor(soundcloud) {
        this.soundCloud = soundcloud;
    }

    getMissingSounds(artistId, callback) {
        var self = this;
        Artist.findById(artistId, function(err, artist) {

            var missingSounds = [];
            addMissingSounds(0, onMissings);

            //TODO if no lastFetchedSong ?

            function onMissings() {
                callback(missingSounds);
            }

            function addMissingSounds(offset, callbackAdd) {

                var options = {
                    n: 5,
                    offset: offset
                };

                self.soundCloud.getLastSongs(options, function(songs)  {
                    var songIds = _.map(songs, 'id');

                    var alreadyFetchedSongIndex = _.findIndex(songIds, artist.lastFetchedSong);

                    if(alreadyFetchedSongIndex !== -1) {
                        // On retire tous les elements apres la derniere chanson trouvée
                        songIds = _.dropRight(songIds, songIds.length - alreadyFetchedSongIndex);
                        missingSounds = missingSounds.concat(songIds);
                        callbackAdd();
                    }
                    else {
                        missingSounds = missingSounds.concat(songIds);
                        addMissingSounds(options.offset + options.n, callbackAdd);
                    }
                })
            }
        });
    }
}

module.exports = ArtistScrapper;
