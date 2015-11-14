var Config = {};

Config.hostname = "song-bridge.herokuapp.com";
Config.port = null;

Config.host = 'http://' + Config.hostname + (Config.port ? ':' + Config.port : '');

module.exports = Config;
