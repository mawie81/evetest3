'use strict';

angular.module('evetest3App')
  .controller('PricecheckCtrl', function ($scope, eveService) {
  	window.scope = $scope;
  	$scope.selectedItems = [];
  	$scope.selectedItemName = '';
  	$scope.selectedItem = {};

  	$scope.chars = [];
  	$scope.selectedCharName = '';
  	$scope.selectedCharId = 0;

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
        localsell: 0
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
      console.log(data);
      for (var i = 0; i < $scope.selectedItems.length; i++) {
        var item = $scope.selectedItems[i];
        for (var j in Object.keys(data)) {
          var resp = data[j];
          if (item.typeID == resp.typeID) {
            item.jitasell = resp.jitaSell;
            item.jitabuy = resp.jitaBuy;
            item.localsell = resp.localSell;
            item.localbuy = resp.localBuy;
          }
        }
      }
      
     });
     
    }

    $scope.onSelectChar = function(char) {
    	$scope.selectedCharId = char.charID;
    	$scope.selectedCharName = char.charName;
    }

    $scope.getMargin = function(sell, buy) {
      if (!sell || !buy) return 0;
      return ((sell - buy) / sell) * 100;
    }
  });
