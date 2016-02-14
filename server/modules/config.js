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
        client_id: process.env.SC_CLIENT_ID || "",
        api_url: "https://api.soundcloud.com/"
    }
};

module.exports = Config;
