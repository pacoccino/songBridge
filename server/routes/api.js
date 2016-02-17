var express = require('express'); // Express web server framework
var request = require('request'); // "Request"

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var Connectors = require('./../connectors/connectors');

var ApiRouter = express.Router({ params: 'inherit' });

var AuthRouter = require('./auth');
var LibRouter = require('./library');
var SandRouter = require('./sand');
var SCRouter = require('./soundcloud');


AuthRouter.use(cookieParser());
AuthRouter.use(bodyParser.json());

AuthRouter.use(session({ secret: 'keyboard cat' , resave: false, saveUninitialized: false}));
AuthRouter.use(passport.initialize());
AuthRouter.use(passport.session());

ApiRouter.get('/', function(req,res) {res.send('api ok')});
ApiRouter.use('/auth', AuthRouter);
ApiRouter.use('/library', LibRouter);
ApiRouter.use('/sand', SandRouter);
ApiRouter.use('/soundcloud', SCRouter);

ApiRouter.get('/connectors', function(req, res) {

    res.json(Connectors.getConnectorsList());
});




module.exports = ApiRouter;