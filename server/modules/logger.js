var winston = require('winston');

var winstonConfig = {
    transports: [
        new (winston.transports.Console)({ level: 'info' })
        /*,
        new (winston.transports.File)({
            filename: 'somefile.log',
            level: 'info'
        })*/
    ]
};

module.exports = new (winston.Logger)(winstonConfig);