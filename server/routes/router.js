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
var querystring = require('querystring'); // "Request"

var Helpers = require('./../modules/helpers');

var ApiRouter = express.Router({ params: 'inherit' });
var AuthRouter = require('./auth');
var LibRouter = require('./library');

ApiRouter.get('/', function(req,res) {res.send('api ok')});
ApiRouter.use('/auth', AuthRouter);
ApiRouter.use('/library', LibRouter);;


module.exports = ApiRouter;