var express = require('express');
var request = require('request');
var _ = require('lodash');
var passport = require('passport');

var Helpers = require('./../modules/helpers');
var Errors = require('./../modules/errors');
var Config = require('./../modules/config');
var SoundCloud = require('./../connectors/soundcloud');
var Authorization = require('../modules/authorization');


var soundcloud = new SoundCloud(Config.services.soundcloud, request);

function LobbyRouterFn(connections) {

    var LobbyRouter = express.Router({ params: 'inherit' });

    var lobbies = connections.models.Lobby;

    LobbyRouter.get('/', function(req,res) {
        res.send('lobbies ok')}
    );

    LobbyRouter.use(Authorization.ensureAuthenticated);

    LobbyRouter.post('/create', function(req, res){
        if(!req.body || !req.body.name) {
            return res.status(400).send("Missing request content");
        }

        var connection = req.user.getConnection('soundcloud');

        var artists = req.body.artists || null;

        soundcloud.newPlaylist(connections.tokens.access_token, req.body.name, artists, function(err, playlist) {

            if(err) {
                Logger.error(err);
                return res.status(500).send("Error creating playlist");
            }

            var lobbyData = {
                sc_id_playlist: playlist.id,
                sc_id_user: connection.userId,
                name: req.body.name,
                artists: req.body.artists
            };

            lobbies.create(lobbyData, function(err, lobby) {
                if(err) {
                    Logger.error(err);
                    return res.status(500).send("Error creating lobby");
                }
                res.status(200).send(lobby.toObject());
            });
        });
    });

    LobbyRouter.get('/:id', function(req, res){

    });

    LobbyRouter.get('/:id/delete', function(req, res){

    });

    return LobbyRouter;
}

module.exports = LobbyRouterFn;