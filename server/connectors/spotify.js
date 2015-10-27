var Spotify = function() {

};

Spotify.infos = {
    serviceId: 'spotify',
    name: 'Spotify'
};

// todo inheritance
Spotify.getPublicInfo = function() {
    return Spotify.infos;
};

module.exports = Spotify;