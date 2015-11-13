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

var Middlewares = require('./../modules/middlewares');

var LibRouter = express.Router({ params: 'inherit' });

LibRouter.get('/', function(req,res) {res.send('library ok')});

LibRouter.use(Middlewares.needConnector());

LibRouter.get('/playlists', function(req, res) {

    req.serviceConnector.getPlaylists(req, res);

});

module.exports = LibRouter;