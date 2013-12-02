'use strict';

angular.module('evetest3App')
  .controller('PricecheckCtrl', function ($scope, eveService) {
  	window.scope = $scope;
    $scope.searchText = '';
  	$scope.selectedItems = [];
  	$scope.selectedItemName = '';
  	$scope.selectedItem = {};

  	$scope.chars = [];
  	$scope.selectedCharName = {};

  	$scope.selectedStationName = '';
  	$scope.selectedStationID = 0;

    $scope.searchItem = function(name) {
		  return eveService.itemSearch(name);
    };
    $scope.onSelect = function(item) {
    	$scope.selectedItem = item;
    	$scope.selectedItemName = item.typeName;
    }
    $scope.addSelectedItem = function() {
    	$scope.selectedItems.push({ 
        typeID: $scope.selectedItem.typeID,
        typeName: $scope.selectedItem.typeName,
        jitabuy: 0,
        jitasell: 0,
        localbuy: 0,
        localsell: 0,
        localMargin: 0,
        jitaMargin: 0
      });
    	$scope.selectedItem = {};
    	$scope.selectedItemName = '';
    }

  	$scope.searchStation = function(name) {
		  return eveService.stationSearch(name);
    };
    $scope.onSelectStation = function(item) {
    	$scope.selectedStationID = item.stationID;
    	$scope.selectedStationName = item.stationName;
    }

    $scope.fetchPrices = function() {
      var typeIDs = [];
      for (var i = 0; i < $scope.selectedItems.length; i++) 
        typeIDs.push($scope.selectedItems[i].typeID);
     eveService.fetchprices($scope.selectedStationID, typeIDs).success(function(data) {
      for (var i = 0; i < $scope.selectedItems.length; i++) {
        var item = $scope.selectedItems[i];
        for (var j in Object.keys(data)) {
          var resp = data[j];
          if (item.typeID == resp.typeID) {
            item.jitasell = resp.jitaSell;
            item.jitabuy = resp.jitaBuy;
            item.localsell = resp.localSell;
            item.localbuy = resp.localBuy;
            item.localMargin = getMargin(resp.localSell, resp.localBuy);
            item.jitaMargin = getMargin(resp.localSell, resp.jitaSell);
          }
        }
      }
      
     });
     
    }

    $scope.fetchFromChar = function() {
      var charID = $scope.selectedChar.charID;
      eveService.getTransactions(charID).success(function(data) {
        var uniqueTypes = [];
        var uniqueTypeIDs = [];
        for (var tan in data) {
          if (uniqueTypeIDs.indexOf(data[tan].typeID) === -1) {
            uniqueTypes.push({ 
              typeID: data[tan].typeID,
              typeName: data[tan].typeName,
              jitabuy: 0,
              jitasell: 0,
              localbuy: 0,
              localsell: 0,
              localMargin: 0,
              jitaMargin: 0
            });
            uniqueTypeIDs.push(data[tan].typeID);
          }
        }
        $scope.selectedItems = uniqueTypes;
      });
    }

    function getMargin(sell, buy) {
      if (!sell || !buy) return 0;
      return ((sell - buy) / sell) * 100;
    }

    eveService.getCharIDs().success(function(result) {
      $scope.chars = result;
    });

    $scope.sort = {
            column: 'localMarign',
            descending: true
        };    
    $scope.changeSorting = function(column) {
        var sort = $scope.sort;
        if (sort.column == column) {
            sort.descending = !sort.descending;
        } else {
            sort.column = column;
            sort.descending = false;
        }
    };
  });
