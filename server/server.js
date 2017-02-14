var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var credentials = require('./credentials.js');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var Quotes = require('./models/theoffice/quotes.js');

var app = express();
mongoose.connect('mongodb://localhost/office');

// security: disables info about server
app.disable('x-powered-by');

// parse body of responses, including encoded URLs
app.use(bodyParser.urlencoded({extended: true}));

// encode cookies using key in credentials.js
app.use(cookieParser(credentials.cookieSecret));

app.set('port', process.env.PORT || 8080);

// make json pretty
app.set('json spaces', 2);

// static files
app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/api/', function(req, res){
	Quotes.find(req.query, function(err, quotes){
		if(err){ handleError(err); } 
		else{ 
			res.status(200).json(quotes);
		}
	});
});

app.get('/api/count/', function(req, res){
	Quotes.count(req.query, function(err, quotes){
		if(err){ handleError(err); } 
		else{  
			res.status(200).json(quotes);
		}
	});
});

app.get('/api/random/', function(req, res){
	Quotes.count(req.query, function(err, count){
		if(err){ handleError(err); } 
		else{
			let random = Math.floor(Math.random() * count);
			Quotes.findOne(req.query).skip(random).exec(function(err, result){
				if(err){ handleError(err); }
				else{
					res.status(200).json(result);
				}
			});
		}
	});
});

function handleError(err, res){
	console.log(err);
	res.status(500).json('Server error');
}

app.listen(app.get('port'), function(){
	console.log('App running on port ' + app.get('port'));
});