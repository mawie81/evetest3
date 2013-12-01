'use strict';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database/sqlite-latest.sqlite');
var eveapi = require('../hamster/hamster');
var async = require('async');
var http = require('http');
var memoryCache = require('../hamster/cache/memory');

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

    async.map(Object.keys(result.characters), getCharacterSheet, function(err, results) {
        if (err) throw err;
        resp.send(results);
      });
  });
};

exports.getCharacterIdAndName = function(req, resp) {
  eveapi.fetch('account:Characters', { },  function(err, characters) {
    async.map(Object.keys(characters.characters),
      function(characterID, characterCallback) {
        characterCallback(null, {
          charID: characterID,
          charName: characters.characters[characterID].name
        });
      },
      function(err, result) {
        resp.send(result);
      });
  });
}

function getCharacterSheet(characterID, callback) {
  eveapi.fetch('char:CharacterSheet', { characterID: characterID }, function(err, sheet) {
      if (err) callback(err, null);
      
      //map the skills
      async.map(Object.keys(sheet.skills), 
        function(skillTypeId, skillCallback) {
          //get skillname
          getTypename(skillTypeId, function(err, skillTypename) {
              if (err) skillCallback(err, null);
              skillCallback(null, {
                skillTypeID: skillTypeId,
                skillName: skillTypename,
                skillpoints: sheet.skills[skillTypeId].skillpoints,
                level: sheet.skills[skillTypeId].level
              });
          });
        },
        function(err, skillResult) {
          //all skills fetched, construct return object
          if (err) callback(err, null);

          //get total skillpoints
          var totalSkillpoints = 0;
          for(var i = 0; i < skillResult.length; i++) {
            totalSkillpoints += parseInt(skillResult[i].skillpoints);
          }

          var data = {
            charName: sheet.name,
            charId: sheet.characterID,
            balance: sheet.balance,
            corporationName: sheet.corporationName,
            allianceName: sheet.allianceName,
            corporationID: sheet.corporationID,
            allianceID: sheet.allianceID,
            totalSkillpoints: totalSkillpoints,
            skills: skillResult
          };
          callback(null, data);
        });
  });
}

exports.getTransactions = function(req, resp) {
  var characterID = req.params.charId;
  getWalletTransactions(characterID, function(err, result) {
    resp.send(result);
  })
}

function getWalletTransactions(characterID, callback) {
  eveapi.fetch('char:WalletTransactions', { characterID: characterID }, function(err, transactions) {
    async.map(Object.keys(transactions.transactions), 
        function(transactionID, transactionCallback) {
          var transaction = transactions.transactions[transactionID];
          getTypedescription(transaction.typeID, function(err, description) {
            var data = {
              transactionDateTime: transaction.transactionDateTime,
              quantity: transaction.quantity,
              typeID: transaction.typeID,
              typeName: transaction.typeName,
              clientID: transaction.clientID,
              clientName: transaction.clientName,
              stationID: transaction.stationID,
              stationName: transaction.stationName,
              transactionType: transaction.transactionType,
              transactionFor: transaction.transactionFor,
              price: transaction.price,
              description: description
            };
            transactionCallback(null, data);
          });
        },
        function(err, result) {
          if (err) callback(err, null);
          callback(null, result);
        }
      );
  });
}

function getWalletJournal(characterID, rowCount, callback) {
  eveapi.fetch('char:WalletJournal', { characterID: characterID, rowCount: rowCount }, function(err, journal) {
    if (err) callback(err, null);
    async.map(Object.keys(journal.transactions),
      function(transactionID, journalCallback) {
        var transaction = journal.transactions[transactionID];
        getRefTypeName(transaction.refTypeID, function(err, refTypeName) {
          if (err) journalCallback(err, null);
          journalCallback(null, {
            refTypeName: refTypeName,
            sender: transaction.ownerName1,
            receiver: transaction.ownerName2,
            amount: transaction.amount,
            reason: transaction.reason,
            isWithdrawl: transaction.ownerID1 === characterID,
            date: transaction.date
          });
        });
      },
      function(err, result) {
        if (err) callback(err, null);
        callback(null, result);
      }
      );
  });
}

exports.getJournal = function(req, resp) {
  var characterID = req.params.charId;
  var rowCount = req.params.rowCount;
  getWalletJournal(characterID,rowCount, function(err, results) {
    resp.send(results);
  });
}

exports.getOrders = function(req, resp) {
  var data = [];
  eveapi.fetch('char:MarketOrders', { characterID: req.params.charId }, function(err, orders) {
    async.map(Object.keys(orders.orders), 
      function(orderId, callback) {
        //get order data
        var order = orders.orders[orderId];

        getTypename(order.typeID, function(err, typeName) {
          if (err) callback(err, null);
          callback(null, { 
            typeID: order.typeID, 
            type: typeName, 
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
        addMarketData(apiResult, function(err, result) {
          if (err) throw err;
          resp.send(result);
        });
      });
  });
};

var typeCache = {}

function cacheTypenames() {
  db.each('select typeID, typeName, description from invTypes', function(err, row) {
    typeCache[row.typeID] = { typeName: row.typeName, description: row.description };
  });
}

cacheTypenames();

function getTypename(typeID, callback) {
  callback(null, typeCache[typeID].typeName);
}

function getTypedescription(typeID, callback) {
 callback(null, typeCache[typeID].description); 
}

function getRefTypeName(refTypeID, callback) {
  eveapi.fetch('eve:RefTypes', { }, function(err, types) {
    if (err) callback(err, null);
    var data = types.refTypes[refTypeID].refTypeName;
    callback(null, data);
  });
}

function addMarketData(apiData, callback) {
  var options = getEveMarketDataUrlForOrders(apiData);

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


function getEveMarketDataUrlForOrders(apiOrders) {
  var typeIds = [];
  var stationIds = [jitaStationId];
  for (var orderId in apiOrders) {
    if (typeIds.indexOf(apiOrders[orderId].typeID) === -1)
      typeIds.push(apiOrders[orderId].typeID);
    if (stationIds.indexOf(apiOrders[orderId].stationId) === -1)
      stationIds.push(apiOrders[orderId].stationId)
  }
  
  return getEveMarketDataUrl(stationIds, typeIds);
}

function getEveMarketDataUrl(stationIds, typeIds) {
  return {
          hostname: 'api.eve-marketdata.com',
          path: '/api/item_prices2.json?char_name=demo&type_ids=' + typeIds.join(',') + '&station_ids=' + stationIds.join(',') + '&buysell=a',
          headers: {'User-Agent': 'hamster.js'}
        };
}

exports.itemsearch = function(req, resp) {
  var name = req.params.itemname;
  db.all('select typeID, typeName, description from invTypes where typeName like ?', '%' + name + '%', function(err, rows) {
    resp.send(rows);
  });
}

exports.stationsearch = function(req, resp) {
  var name = req.params.stationname;
  db.all('select stationID, stationName from staStations where stationName like ?', name + '%', function(err, rows) {
    resp.send(rows);
  });
}

exports.fetchprices = function(req, resp) {
  var station = req.query.station;
  var types = req.query.typeIDs.split(',');

  var url = getEveMarketDataUrl([station, jitaStationId], types);

  http.get(url, function(marketDataResponse) {
    var marketData = '';
    marketDataResponse.setEncoding('utf8');
    marketDataResponse.on('data', function(chunk) {
      marketData += chunk;
    });
    marketDataResponse.on('end', function(err) {
      marketData = JSON.parse(marketData);
      var result = marketData[Object.keys(marketData)[0]].result;
      var data = [];
      //do in parallel
      for (var i = 0; i < types.length; i++) {
        var typeID = types[i];
        var jitaSell = getMarketObject(result, typeID, jitaStationId, 's');
        var jitaBuy = getMarketObject(result, typeID, jitaStationId, 'b');
        var localSell = getMarketObject(result, typeID, station, 's');
        var localBuy = getMarketObject(result, typeID, station, 'b');
        data.push({
          jitaSell: jitaSell.row.price,
          jitaBuy: jitaBuy.row.price,
          localSell: localSell.row.price,
          localBuy: localBuy.row.price,
          typeID: typeID
        });
      }
      console.log(data);
      resp.send(data);
    });
  }).on('error', function(e) {
    console.log('Got error ' + e.message);
    resp.send(null);
  });

}