"use strict";

class RamCache {

    constructor() {
        this.memory = {};
    }

    get(name, callback) {
        var cached = this.memory[name];

        if(cached) {
            var now = Date.now();
            if(cached.expiration < now) {
                return callback(null, cached.data);
            }
            else {
                delete this.memory[name];
            }
        }

        callback(null, null);
    }

    set(name, value, options, callback) {

        this.memory[name] = {
            data: value
        };

        if(options.expiration) {
            var now = Date.now();
            this.memory[name].expiration = now + options.expiration;
        }

        callback(null);
    }
}

module.exports = RamCache;