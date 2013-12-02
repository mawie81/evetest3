'use strict';

// Module dependencies.
var express = require('express'),
    path = require('path');

var app = express();

// Controllers
var api = require('./lib/controllers/api');

// Express Configuration
app.configure(function(){
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
});

app.configure('development', function(){
  app.use(express.static(path.join(__dirname, '.tmp')));
  app.use(express.static(path.join(__dirname, 'app')));
  app.use(express.errorHandler());
});

app.configure('production', function(){
  app.use(express.favicon(path.join(__dirname, 'public/favicon.ico')));
  app.use(express.static(path.join(__dirname, 'public')));
});

// Routes
app.get('/api/chars', api.getChars);
app.get('/api/orders/:charId', api.getOrders);
app.get('/api/transactions/:charId', api.getTransactions);
app.get('/api/journal/:charId/:rowCount', api.getJournal);
app.get('/api/charIDsAndName', api.getCharacterIdAndName);
app.get('/api/itemsearch/:itemname', api.itemsearch);
app.get('/api/stationsearch/:stationname', api.stationsearch);
app.get('/api/fetchprices', api.fetchprices);
app.get('/api/skillInTraining/:charId', api.skillInTraining);

// Start server
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});