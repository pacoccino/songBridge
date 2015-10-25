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

var LibRouter = express.Router({ params: 'inherit' });


LibRouter.get('/', function(req,res) {res.send('library ok')});

LibRouter.get('/playlists', function(req, res) {

    var options = {
        url: 'https://api.spotify.com/v1/users/ehpys/playlists',
        headers: { 'Authorization': 'Bearer ' + loggedtoken },
        json: true
    };

    // use the access token to access the Spotify Web API
    request.get(options, function(error, response, body) {
        console.log(body);
        res.json(body);
    });

});


module.exports = LibRouter;