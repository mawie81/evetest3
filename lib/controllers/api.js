'use strict';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database/sqlite-latest.sqlite');
var eveapi = require('../hamster/hamster');
 
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

exports.testEveapi = function(req, res) {
  var data = [];
  eveapi.fetch('account:Characters', { keyID: '2782510', vCode: 'znXDL40gC5PG8a9ZhwyhBxlCixE17551jF198OpFAF9W0nKi5VUxarcO5qcEvrvA'}, function(err, result) {
    if (err) throw err;
    async.parallel([
      function(callback) {

        for(var characterId in result.characters){
          console.log(characterId);
          eveapi.fetch('char:AccountBalance', { keyID: '2782510', vCode: 'znXDL40gC5PG8a9ZhwyhBxlCixE17551jF198OpFAF9W0nKi5VUxarcO5qcEvrvA', characterID: characterId, accountKey: 1000 }, function(err, balance) {
             if (err) throw err
              console.log("balancex");
             console.log(balance);
             for(var accountId in balance.accounts)
             {
               data.push( {charName: result.characters[characterId].name, charId: result.characters[characterId].characterID, balance: balance.accounts[accountId].balance });
             }
          });
        }
      }
    ], function(err){
        res.send(data);
    });
    
  });
};

/*

key 2782510
Verification Code: znXDL40gC5PG8a9ZhwyhBxlCixE17551jF198OpFAF9W0nKi5VUxarcO5qcEvrvA
Access Mask: 268435455
Expires: 2014/11/15
*/