const express = require('express'); // Express web server framework
const request = require('request'); // "Request"

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const Connectors = require('./../connectors/connectors');

var SandRouter = require('./sand');
var SCRouter = require('./soundcloud');
var Authorization = require('../modules/authorization');

function ApiRouterFn(connections) {
    var ApiRouter = express.Router({ params: 'inherit' });

    ApiRouter.use(cookieParser());
    ApiRouter.use(bodyParser.json());

    ApiRouter.use(session(
        {
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: false,
            store: new MongoStore(
                { mongooseConnection: connections.mongo }
            )
        }));

    ApiRouter.use(passport.initialize());
    ApiRouter.use(passport.session());
    ApiRouter.use(Authorization.noSessionAuth(connections));

    Authorization.bindOAuth(passport, connections);

    ApiRouter.get('/', function(req,res) {res.send('api ok')});

    //ApiRouter.use('/auth', AuthRouter);
    //ApiRouter.use('/library', LibRouter);
    ApiRouter.use('/sand', SandRouter);
    ApiRouter.use('/soundcloud', SCRouter(connections));

    ApiRouter.get('/connectors', function(req, res) {

        res.json(Connectors.getConnectorsList());
    });

    return ApiRouter;
}

module.exports = ApiRouterFn;