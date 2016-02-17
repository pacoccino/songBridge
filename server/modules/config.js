var defaultConfig = require('../config.json');

var Config = {
    protocol: defaultConfig.protocol,
    hostname: process.env.HOST || defaultConfig.hostname,
    web_port: process.env.WEB_PORT || process.env.PORT || defaultConfig.web_port,
    api_port: process.env.API_PORT || process.env.PORT || defaultConfig.api_port,
    proxied: process.env.PROXIED || defaultConfig.proxied,
    staticFolder: defaultConfig.staticFolder
};

Config.host = Config.protocol + '://' + Config.hostname + (Config.port && !Config.proxied ? (':' + Config.port) : '');

Config.services = {
    soundcloud: {
        client_id: process.env.SC_CLIENT_ID || defaultConfig.services.soundcloud.client_id,
        client_secret: process.env.SC_CLIENT_SECRET || defaultConfig.services.soundcloud.client_secret
    }
};

Config.connections = {
    mongoUrl: process.env.MONGO_URL || defaultConfig.connections.mongoUrl
};

module.exports = Config;
