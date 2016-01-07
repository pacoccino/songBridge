var defaultConfig = require('../config.json');

var Config = {
    protocol: defaultConfig.protocol,
    hostname: defaultConfig.hostname,
    port: process.env.PORT || defaultConfig.port
};

Config.host = Config.protocol + '://' + Config.hostname + (Config.port ? (':' + Config.port) : '');

module.exports = Config;
