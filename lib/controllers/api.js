'use strict';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database/sqlite-latest.sqlite');
 
exports.awesomeThings = function(req, res) {
  res.json([
    {
      name : 'HTML5 Boilerplate',
      info : 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.',
      awesomeness: 10
    }, {
      name : 'AngularJS',
      info : 'AngularJS is a toolset for building the framework most suited to your application development.',
      awesomeness: 10
    }, {
      name : 'Karma',
      info : 'Spectacular Test Runner for JavaScript.',
      awesomeness: 10
    }, {
      name : 'Express',
      info : 'Flexible and minimalist web application framework for node.js.',
      awesomeness: 10
    }
  ]);
};

exports.test = function(req, res) {
	db.serialize(function() {
	  db.all("SELECT mapRegions.regionName, mapRegions.regionID, chrFactions.factionName, chrFactions.description FROM mapRegions inner join chrFactions on mapRegions.factionID = chrFactions.factionID order by mapRegions.regionName", function(err, rows) {
		 return res.json(rows)
	  });
	});
};
