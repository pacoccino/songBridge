var Config = {};

Config.protocol = "http";
Config.hostname = "localhost";
Config.port = 8080;

Config.host = Config.protocol + '://' + Config.hostname + (Config.port ? (':' + Config.port) : '');

module.exports = Config;
