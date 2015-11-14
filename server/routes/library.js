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