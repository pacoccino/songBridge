"use strict";

var express = require('express');
var request = require('request');


var Config = require('../modules/config');

var ApiRouter = require('../routes/api');

var app = express();

app.set('port', Config.web_port);

app.use(express.static(__dirname + "/" + Config.staticFolder));

app.use('/api', ApiRouter);

console.log('Listening on '+ app.get('port'));
app.listen(app.get('port'));
