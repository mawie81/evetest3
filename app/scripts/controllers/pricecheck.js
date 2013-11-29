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
    	$scope.selectedItems.push($scope.selectedItem);
    	$scope.selectedItem = {};
    	$scope.selectedItemName = '';
    }

	$scope.searchStation = function(name) {
		return eveService.itemSearch(name);
    };
    $scope.onSelectStation = function(item) {
    	$scope.selectedStationID = item.stationID;
    	$scope.selectedStationName = item.stationName;
    }

    $scope.fetchPrices = function() {

    }

    $scope.onSelectChar = function(char) {
    	$scope.selectedCharId = char.charID;
    	$scope.selectedCharName = char.charName;
    }
  });
