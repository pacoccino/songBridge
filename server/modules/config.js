var defaultConfig = require('../config.json');

var Config = {
    protocol: defaultConfig.protocol || 'http',
    hostname: process.env.HOST || defaultConfig.hostname || 'localhost',
    proxied: process.env.PROXIED || false,
    port: process.env.PORT || defaultConfig.port || 8080
};

Config.host = Config.protocol + '://' + Config.hostname + (Config.port && !Config.proxied ? (':' + Config.port) : '');

Config.services = {
    soundcloud: {
        client_id: ""
    }
};

module.exports = Config;
