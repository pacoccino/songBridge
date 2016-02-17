var express = require('express'); // Express web server framework
var request = require('request'); // "Request"

var Logger = require('./../modules/logger');

var Middlewares = require('./../modules/middlewares');

var LibRouter = express.Router({ params: 'inherit' });

LibRouter.get('/', function(req,res) {res.send('library ok')});

LibRouter.use(Middlewares.auth());
LibRouter.use(Middlewares.connectors());
LibRouter.use(Middlewares.needConnector());
LibRouter.use(Middlewares.needConnection());

LibRouter.get('/playlists', function(req, res) {

    req.serviceConnector.getPlaylistList(req.user, function(err, playlists) {
        if(err) {
            Logger.error("Error while getting playlists", err);
        }
        else {
            res.json(playlists);
        }
    });

});

module.exports = LibRouter;