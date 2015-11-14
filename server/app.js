"use strict";

var express = require('express'); // Express web server framework
var request = require('request'); // "Request"
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var Config = require('../config/config');

var ApiRouter = require('./routes/router');
var Middlewares = require('./modules/middlewares');

var app = express();

app.set('port', (Config.port || process.env.PORT || 8080))

app.use(cookieParser());
//app.use(bodyParser.json());

app.use(Middlewares.auth());
app.use(Middlewares.connectors());

app.use('/api', ApiRouter);

app.use(express.static(__dirname + '/../app'));

console.log('Listening on '+app.get('port'));
app.listen(app.get('port'));
