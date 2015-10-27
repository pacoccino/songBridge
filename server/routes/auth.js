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
var Errors = require('./../modules/errors');
var Connectors = require('./../connectors/connectors');

var AuthRouter = express.Router({ params: 'inherit' });

var client_id = '29301ecd40bc431096167df74fd4937c'; // Your client id
var client_secret = '791f299041f0455c83d95b8854a91bb3'; // Your client secret
var redirect_uri = 'http://localhost:8080/api/auth/callback'; // Your redirect uri

var stateKey = 'spotify_auth_state';

AuthRouter.get('/', function(req,res) {res.send('auth ok')});

AuthRouter.get('/login/:serviceId?', function(req, res) {

    var connector = Connectors.getConnector(req.params.serviceId);

    if(connector) {

        var state = Helpers.generateRandomString(16);
        res.cookie(stateKey, state);

        // your application requests authorization
        var scope = 'user-read-private user-read-email';
        res.redirect('https://accounts.spotify.com/authorize?' +
                     querystring.stringify({
                         response_type: 'code',
                         client_id: client_id,
                         scope: scope,
                         redirect_uri: redirect_uri,
                         state: state
                     }));
    }
    else {
        Errors.sendError(res, 'UNKNOWN_SERVICE');
    }

});

AuthRouter.get('/callback/:service?', function(req, res) {

    var connector = Connectors.getConnector(req.params.serviceId);

    if(connector) {
        // your application requests refresh and access tokens
        // after checking the state parameter

        var code = req.query.code || null;
        var state = req.query.state || null;
        var storedState = req.cookies ? req.cookies[stateKey] : null;

        if (state === null || state !== storedState) {
            res.redirect('/#' +
                querystring.stringify({
                    error: 'state_mismatch'
                }));
        } else {
            res.clearCookie(stateKey);
            var authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                form: {
                    code: code,
                    redirect_uri: redirect_uri,
                    grant_type: 'authorization_code'
                },
                headers: {
                    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                },
                json: true
            };

            request.post(authOptions, function(error, response, body) {
                if (!error && response.statusCode === 200) {

                    var access_token = body.access_token,
                        refresh_token = body.refresh_token;

                    res.cookie('access_token', access_token);

                    var options = {
                        url: 'https://api.spotify.com/v1/me',
                        headers: { 'Authorization': 'Bearer ' + access_token },
                        json: true
                    };

                    // use the access token to access the Spotify Web API
                    request.get(options, function(error, response, body) {
                        console.log(body);
                    });

                    // we can also pass the token to the browser to make requests from there
                    res.redirect('/#' +
                        querystring.stringify({
                            access_token: access_token,
                            refresh_token: refresh_token
                        }));
                } else {
                    res.redirect('/#' +
                        querystring.stringify({
                            error: 'invalid_token'
                        }));
                }
            });
        }
    }
    else {
        Errors.sendError(res, 'UNKNOWN_SERVICE');
    }
});

AuthRouter.get('/refresh/:service?', function(req, res) {

    var connector = Connectors.getConnector(req.params.serviceId);

    if(connector) {

        // requesting access token from refresh token
        var refresh_token = req.query.refresh_token;
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
            form: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var access_token = body.access_token;
                res.send({
                    'access_token': access_token
                });
            }
        });
    }
    else {
        Errors.sendError(res, 'UNKNOWN_SERVICE');
    }
});


module.exports = AuthRouter;