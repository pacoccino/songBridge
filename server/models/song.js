var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectId;

class Song {
    constructor() {
        this._id = new ObjectId().toString();

        this.title = "";
        this.album = "";
        this.artist = "";
        this.year = null;
        this.servicesData = [];
    }

    compare(song) {
        //TODO
        return false;
    }

    addServiceData(serviceData) {
        //TODO
        return false;
    }

    merge(song) {
        //TODO
        return false;
    }

    search(searchData) {
        //TODO
        return false;
    }

    describeFromServiceDatas() {
        //TODO
        return false;
    }
}