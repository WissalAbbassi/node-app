var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config/config.js');
var apiRouterAdmin = require('./routesAdmin').router;

//instance express
var app = express();

var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
if(req.headers['x-api-key'] != config.x_api_key){
  return res.status(401).json({ 'error': 'x_api_key incorrect' });
}
});

app.use('/', apiRouterAdmin);
let port = 8080;
app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});

module.exports = app;