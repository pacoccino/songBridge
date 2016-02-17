var express = require('express');
var session = require('express-session');

var ApiRouter = require('../routes/api');
var Config = require('../modules/config');

var app = express();

app.set('port', Config.api_port);

app.use(ApiRouter);

console.log('Listening on '+ app.get('port'));
app.listen(app.get('port'));
