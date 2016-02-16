"use strict";

var express = require('express');
var request = require('request');
var passport = require('passport');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var Config = require('./modules/config');

var ApiRouter = require('./routes/router');
var Middlewares = require('./modules/middlewares');

var app = express();

app.set('port', Config.port);

app.use(express.static(__dirname + '/../app'));

app.use(cookieParser());
//app.use(bodyParser.json());

app.use(session({ secret: 'keyboard cat' }));

app.use(Middlewares.auth());
app.use(Middlewares.connectors());

app.use('/api', ApiRouter);


console.log('Listening on '+ app.get('port'));
app.listen(app.get('port'));
