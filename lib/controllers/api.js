'use strict';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database/sqlite-latest.sqlite');
var eveapi = require('../hamster/hamster');
var async = require('async');
var http = require('http');

var jitaStationId = 60003760;

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
          callback(null, { 
            typeID: order.typeID, 
            type: row.typeName, 
            volRemaining: order.volRemaining, 
            volEntered: order.volEntered, 
            price: order.price, 
            bid: order.bid, 
            jitasell: 0, 
            localsell: 0,
            stationId: order.stationID,
            margin: 0 });
        });
        
      },
      function(err, apiResult) {
        if (err) throw err;
        console.log('Done fetching orders from api');
        addMarketData(apiResult, function(err, result) {
          if (err) throw err;
          resp.send(result);
        });
      });
  });
};

function addMarketData(apiData, callback) {
  var options = getEveMarketDataUrl(apiData);

  http.get(options, function(marketDataResponse) {
    var marketData = '';
    marketDataResponse.setEncoding('utf8');
    marketDataResponse.on('data', function(chunk) {
      marketData += chunk;
    });
    marketDataResponse.on('end', function(err) {
      marketData = JSON.parse(marketData);
      //do in parallel
      for (var market in marketData) {
        for (var r in apiData) {
          var marketObject = getMarketObject(marketData[market].result, apiData[r].typeID, jitaStationId, 's');
          if (marketObject)
            apiData[r].jitasell = marketObject.row.price;
          var localSellObject =  getMarketObject(marketData[market].result, apiData[r].typeID, apiData[r].stationId, 's');
          console.log(localSellObject);
          if (localSellObject)
            apiData[r].localsell = localSellObject.row.price;
          apiData[r].margin = ((apiData[r].localsell - apiData[r].jitasell) / apiData[r].localsell) * 100
        }
      }
      callback(null, apiData);
    });
  }).on('error', function(e) {
    console.log('Got error ' + e.message);
    callback(e, null);
  });
}

function getMarketObject(marketData, typeId, stationId, buysell) {
  var data;
  marketData.some(function(entry) {
    if (entry.row.stationID == stationId && entry.row.typeID == typeId && entry.row.buysell == buysell) {
      data = entry;
      return true;
    }
  });
  return data;
}


function getEveMarketDataUrl(apiOrders) {
  var typeIds = [];
  var stationIds = [jitaStationId];
  for (var orderId in apiOrders) {
    if (typeIds.indexOf(apiOrders[orderId].typeID) === -1)
      typeIds.push(apiOrders[orderId].typeID);
    if (stationIds.indexOf(apiOrders[orderId].stationId) === -1)
      stationIds.push(apiOrders[orderId].stationId)
  }
  
  return {
          hostname: 'api.eve-marketdata.com',
          path: '/api/item_prices2.json?char_name=demo&type_ids=' + typeIds.join(',') + '&station_ids=' + stationIds.join(',') + '&buysell=a',
          headers: {'User-Agent': 'hamster.js'}
        };
}




/*

key 2782510
Verification Code: znXDL40gC5PG8a9ZhwyhBxlCixE17551jF198OpFAF9W0nKi5VUxarcO5qcEvrvA
Access Mask: 268435455
Expires: 2014/11/15
*/