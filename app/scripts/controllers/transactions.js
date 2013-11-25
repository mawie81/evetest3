'use strict';

angular.module('evetest3App')
  .controller('TransactionsCtrl', function ($scope, $routeParams, eveService) {
  	window.scope = $scope;
  	$scope.searchText = '';
   	eveService.getTransactions($routeParams.charId).success(function(data) {
 		$scope.transactions = data;
    });
  });
