var Config = require('../modules/config');

var client_id = Config.services.soundcloud.client_id;

class SoundCloud {
    updatePlaylist(playlistId, user, tracks) {

        var userId = user.sc_id_user;
        var endpoint = "playlist/" + playlistId;
        var options =  {
            method: 'PUT'
        };
        var params = {
            access_token: user.auth.token
        };
        var data = {
            tracks: tracks
        };
    }

    getPlaylist(playlistId, user, callback) {
        var userId = user.sc_id_user;
        var endpoint = "playlist/" + playlistId;
        var options =  {
            method: 'GET'
        };
        var params = {
            client_id: client_id
        };
    }

    addToPlaylist(playlistId, user, tracks) {
        this.getPlaylist(playlistId, user, function(playlist) {
            var playlistTracks = _.map(playlist.tracks, 'id');

            var newPlaylistTracks = playlistTracks.concat(tracks);
            newPlaylistTracks = _.map(newPlaylistTracks, function(trackId) {return {id: trackId}});

            self.updatePlaylist(playlistId, user, newPlaylistTracks);
        })
    }
    addToPlaylistTop(playlistId, user, tracks) {
        this.getPlaylist(playlistId, user, function(playlist) {
            var playlistTracks = _.map(playlist.tracks, 'id');

            var newPlaylistTracks = tracks.concat(playlistTracks);
            newPlaylistTracks = _.map(newPlaylistTracks, function(trackId) {return {id: trackId}});

            self.updatePlaylist(playlistId, user, newPlaylistTracks);
        })
    }
}

module.exports = SoundCloud;
