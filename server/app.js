/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

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
