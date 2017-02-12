var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var credentials = require('./credentials.js');
var express = require('express');
var path = require('path');

var app = express();

// security: disables info about server
app.disable('x-powered-by');

// parse body of responses, including encoded URLs
app.use(bodyParser.urlencoded({extended: true}));

// encode cookies using key in credentials.js
app.use(cookieParser(credentials.cookieSecret));

app.set('port', process.env.PORT || 8080);

// static files
app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/', function(req, res){
	res.send('Hello World');
});

app.listen(app.get('port'), function(){
	console.log('App running on port ' + app.get('port'));
});