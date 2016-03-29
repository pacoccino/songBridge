var express = require('express');
var session = require('express-session');

var ApiRouter = require('../routes/api');
var Config = require('../modules/config');
var Application = require('../modules/application');
var Logger = require('../modules/logger');

var app = express();

app.set('port', Config.api_port);

Application.ready.then(function() {

    Logger.info("Initiating api worker ...");
    app.use(ApiRouter(Application.connections));

    Logger.info('Listening on '+ app.get('port'));
    app.listen(app.get('port'));
});

Application.init();

