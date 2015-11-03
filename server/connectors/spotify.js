var querystring = require('querystring');
var request = require('request'); // "Request"

var Config = require('../config/config');

var Spotify = function() {

};

Spotify.infos = {
    serviceId: 'spotify',
    name: 'Spotify'
};

var client_id = '29301ecd40bc431096167df74fd4937c';
var client_secret = '791f299041f0455c83d95b8854a91bb3';
var redirect_uri = Config.host + '/api/auth/callback/' + Spotify.infos.serviceId;
var authorizeUrl = 'https://accounts.spotify.com/authorize';

var cookie_name = Spotify.infos.serviceId + '_access_token';

Spotify.askLogin = function(req, res, state) {

    var scope = 'user-read-private user-read-email';
    res.redirect(authorizeUrl + '?' +
                 querystring.stringify({
                     response_type: 'code',
                     client_id: client_id,
                     scope: scope,
                     redirect_uri: redirect_uri,
                     state: state
                 })
    );
};

Spotify.authCallback = function(req,res) {

    var code = req.query.code || null;

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

            res.cookie(cookie_name, access_token);

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
};

Spotify.logout = function(req, res) {

    res.clearCookie(cookie_name);
    res.send('Successfully logged out');
};

Spotify.refreshToken = function(req, res) {
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
};

module.exports = Spotify;