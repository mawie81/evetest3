'use strict';

angular.module('evetest3App')
  .controller('OrdersCtrl', function ($scope, $routeParams, eveService) {
  	window.scope = $scope;
    $scope.charId = $routeParams.charId;
    $scope.buyOrders = [];
    $scope.sellOrders = [];
    $scope.searchText = '';

    eveService.getOrders($routeParams.charId).success(function(data) {
    	if (!data) return;
    	for (var order in data)
    	{
    		if (data[order].bid === '1')
    			$scope.buyOrders.push(data[order]);
    		else $scope.sellOrders.push(data[order]);
    	}
    });
  });
