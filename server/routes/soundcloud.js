var express = require('express'); // Express web server framework
var request = require('request'); // "Request"

var Helpers = require('./../modules/helpers');
var Errors = require('./../modules/errors');
var Config = require('./../modules/config');
var Middlewares = require('./../modules/middlewares');
var SoundCloud = require('./../crawlers/soundcloud');

var SoundcloudRouter = express.Router({ params: 'inherit' });

var soundcloud = new SoundCloud(Config.services.soundcloud, request);

SoundcloudRouter.get('/', function(req,res) {
    res.send('soundcloud ok')}
);

SoundcloudRouter.get('/get/:resource/:resourceId?/:subResource?/:subResourceId?', function(req,res) {

    var userToken = req.query.token || req.cookies["SOUNDCLOUD_TOKEN"] || null;

    var scReq = soundcloud.newRequest(userToken);
    try {
        if (req.params.resource) {
            scReq.appendResource(req.params.resource, req.params.resourceId);
            if (req.params.subResource) {
                scReq.appendResource(req.params.subResource, req.params.subResourceId);
            }
        }
        scReq.get(function (err, result) {
            if(err) {
                res.send(err);
            }
            else {
                res.send(result)
            }
        });
    }
    catch (e) {
        res.send(e.message || e);
    }
});

module.exports = SoundcloudRouter;