
var express = require('express'); // Express web server framework
var request = require('request'); // "Request"
var cookieParser = require('cookie-parser');

var ApiRouter = require('./routes/router');

var app = express();

app.use(cookieParser());

app.use('/api', ApiRouter);

app.use(express.static(__dirname + '/../app'));

console.log('Listening on 8080');
app.listen(8080);
