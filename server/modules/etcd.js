var Etcd = require('node-etcd');
var async = require('async');

var Config = require('./config');
var Logger = require('./logger');

var host = "192.168.1.23";
var port = 2379;

var etcd;

var EtcdAccessor = {};

EtcdAccessor.prefix = "SongBridge_";
EtcdAccessor.configToRetrieve = [
    {
        varName :"MONGO_URL",
        varPath: "connections.mongoUrl"
    },
    {
        varName :"SOUNDCLOUD_CLIENT_ID",
        varPath: "services.soundcloud.client_id"
    },
    {
        varName :"SOUNDCLOUD_CLIENT_SECRET",
        varPath: "services.soundcloud.client_secret"
    }
];

EtcdAccessor.init = function(callback) {
    var sslOptions = {
        ca: Config.ssl.ca,
        cert: Config.ssl.cert,
        key: Config.ssl.key
    };
    sslOptions = null;

    var etcd = new Etcd(Config.etcd.host, Config.etcd.port, sslOptions);
    etcd.get("dumb_key_to_assert_connected", function(error) {
        if(!error || error.errorCode === 100) {
            EtcdAccessor.etcd = etcd;

            return callback && callback(null);
        }

        var connectionError = new Error("etcd connection failed to all servers");
        callback(connectionError);
    });
};

EtcdAccessor.config = function(callback) {
    if(!EtcdAccessor.etcd) {
        Logger.warn("etcd configurator called without connection open");
        return callback(null);
    }

    async.each(EtcdAccessor.configToRetrieve, setConfig, callback);

    function setConfig(config, setCb) {
        EtcdAccessor.etcd.get(EtcdAccessor.prefix + config.varName, function(error, getResult) {

            if(error || !(getResult && getResult.node && getResult.node.value)) {
                Logger.silly('etcd config not found for ' + config.varName);
                return setCb(null);
            }
            var value = getResult.node.value;
            var varPath = config.varPath.split('.');

            var configObject = Config;

            for (var i = 0; i < varPath.length; i++) {
                var propName = varPath[i];
                if(i === varPath.length - 1) {
                    configObject[propName] = value;
                } else {
                    configObject[propName] = configObject[propName] || {};
                    configObject = configObject[propName];
                }
            }
            setCb(null);
        });
    }
};

module.exports = EtcdAccessor;