var Config = {};

Config.protocol = "http";
Config.hostname = "song-bridge.herokuapp.com";
Config.port = null;

Config.host = Config.protocol + '://' + Config.hostname + (Config.port ? (':' + Config.port) : '');

module.exports = Config;
