'use strict';

angular.module('evetest3App')
  .controller('TransactionsCtrl', function ($scope, $routeParams, eveService) {
    window.scope = $scope;
  	$scope.searchText = '';
  	$scope.sort = {
            column: 'transactionDateTime',
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
   	eveService.getTransactions($routeParams.charId).success(function(data) {
 		$scope.transactions = data;
    });
    eveService.getJournal($routeParams.charId).success(function(data) {
    	$scope.journal = data;
    });
  });
