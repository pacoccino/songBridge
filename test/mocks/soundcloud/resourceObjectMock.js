var resourceObject = function(mData) {
    this.mData = mData;
};

resourceObject.prototype.users = function(userId) {
    this.mData.userId = userId;
    return this;
};
resourceObject.prototype.playlists = function(playlistId) {
    this.mData.playlistId = playlistId;
    return this;
};
resourceObject.prototype.tracks = function(trackId) {
    this.mData.trackId = trackId;
    return this;
};
resourceObject.prototype.get = function(a, c) {
    this.mData.getOptions = a;
    c(this.mData.getError, this.mData.getData);
};
resourceObject.prototype.put = function(d, c) {
    this.mData.putData = d;
    c(this.mData.putError);
};


module.exports = resourceObject;