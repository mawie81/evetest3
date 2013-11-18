'use strict';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database/sqlite-latest.sqlite');
var eveapi = require('../hamster/hamster');
var async = require('async');

exports.test = function(req, res) {
	db.serialize(function() {
	  db.all("SELECT mapRegions.regionName, mapRegions.regionID, chrFactions.factionName, chrFactions.description FROM mapRegions inner join chrFactions on mapRegions.factionID = chrFactions.factionID order by mapRegions.regionName", function(err, rows) {
		 return res.json(rows)
	  });
	});
};

// Set default parameters (useful for setting keyID and vCode)
eveapi.setParams({
  keyID: '27825100',
  vCode: 'znXDL40gC5PG8a9ZhwyhBxlCixE17551jF198OpFAF9W0nKi5VUxarcO5qcEvrvA0'
})

exports.getChars = function(req, resp) {
  var data = [];
  eveapi.fetch('account:Characters', { }, function(err, result) {
    if (err) throw err;

    async.map(Object.keys(result.characters),  
      function (characterId, callback) {
        eveapi.fetch('char:AccountBalance', { characterID: characterId, accountKey: 1000 }, function(err, balance) {
          if (err) callback(err, null);
          callback(null, { charName: result.characters[characterId].name, charId: characterId, balance: balance.accounts[Object.keys(balance.accounts)[0]].balance });
        });
      },
      function(err, results) {
        if (err) throw err;
        resp.send(results);
      });
  });
};

exports.getOrders = function(req, resp) {
  console.log('getOrders');
  var data = [];
  eveapi.fetch('char:MarketOrders', { characterID: req.params.charId }, function(err, orders) {
    async.map(Object.keys(orders.orders), 
      function(orderId, callback) {
        //get order data
        var order = orders.orders[orderId];
        db.get('select typeName from invTypes where typeID = ?', order.typeID, function(err, row) {
          if (err)
          {
            callback(err, null);
            return;
          }
          callback(null, { typeID: order.typeID, type: row.typeName, volRemaining: order.volRemaining, volEntered: order.volEntered, price: order.price, bid: order.bid });
        });
        
      },
      function(err, result) {
        if (err) throw err;
        resp.send(result);
      });
  });
};




/*

key 2782510
Verification Code: znXDL40gC5PG8a9ZhwyhBxlCixE17551jF198OpFAF9W0nKi5VUxarcO5qcEvrvA
Access Mask: 268435455
Expires: 2014/11/15
*/