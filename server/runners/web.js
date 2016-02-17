var express = require('express');

var Config = require('../modules/config');

var app = express();

app.set('port', Config.web_port);

app.use(express.static(__dirname + "/" + Config.staticFolder));

console.log('Listening on '+ app.get('port'));
app.listen(app.get('port'));