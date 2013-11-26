'use strict';

angular.module('evetest3App')
  .controller('TransactionsCtrl', function ($scope, $routeParams, $location, eveService) {
    window.scope = $scope;
    var charID = $routeParams.charId
    $scope.staticRoutePart = $location.path().replace(charID, '');
  	$scope.searchText = '';
  	$scope.sortTransaction = {
            column: 'transactionDateTime',
            descending: true
        };    
    $scope.changeTransactionSorting = function(column) {
        var sort = $scope.sortTransaction;
        if (sort.column == column) {
            sort.descending = !sort.descending;
        } else {
            sort.column = column;
            sort.descending = false;
        }
    };

     $scope.changeJournalSorting = function(column) {
        var sort = $scope.sortJournal;
        if (sort.column == column) {
            sort.descending = !sort.descending;
        } else {
            sort.column = column;
            sort.descending = false;
        }
    };

    $scope.sortJournal = {
            column: 'date',
            descending: true
        };

    $scope.getParticipant = function(transaction) {
    	if (transaction.isWithdrawl) return transaction.receiver;
    	return transaction.sender;
    }
   	eveService.getTransactions(charID).success(function(data) {
 		$scope.transactions = data;
    });
    eveService.getJournal(charID).success(function(data) {
    	$scope.journal = data;
    });
    eveService.getCharIDs().success(function(data) {
    	$scope.characters = data;
    });
  });
