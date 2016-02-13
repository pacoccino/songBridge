var soundcloudMock = {
    updatePlaylist: function(playlistId, user, trackList, callback) {
        this.updatePlaylistData = {
            playlistId: playlistId,
            user: user,
            trackList: trackList
        };
        callback(this.updatePlaylistError);
    },
    getLastArtistSongs: function(artistId, options, callback) {
        callback(this.getLastArtistSongsError, this.getLastArtistSongsData);
    },
    getTimestamp: function(track) {
        return 0;
    }
};

soundcloudMock.reset = function() {
    soundcloudMock.getLastArtistSongsData = null;
    soundcloudMock.getLastArtistSongsError = null;
    soundcloudMock.updatePlaylistData = null;
    soundcloudMock.updatePlaylistError = null;
};

module.exports = soundcloudMock;