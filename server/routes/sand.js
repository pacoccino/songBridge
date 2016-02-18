var express = require('express'); // Express web server framework
var request = require('request'); // "Request"

var SandRouter = express.Router();

SandRouter.get('/', function(req,res) {res.send('sand ok')});

SandRouter.get('/aa', function(req, res) {

    res.json(req.user);
});

SandRouter.get('/req/:param', function(req, res) {

    console.log("get");
    res.send(req.bla);

});


SandRouter.param('param', function(req, res, next, name) {

    if(name==="hello") {
        req.bla = "bla";
        next();
    }
    else {
        req.bla = "root";
        res.send("no");
        next();
    }
});


module.exports = SandRouter;