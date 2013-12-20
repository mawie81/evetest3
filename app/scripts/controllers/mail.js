'use strict';

angular.module('evetest3App')
  .controller('MailCtrl', function ($scope, $routeParams, eveService) {
  	window.scope = $scope;
  	var charID = $routeParams.charId

  	$scope.sort = {
            column: 'sentDate',
            descending: true
        };    

  	eveService.getMail(charID).success(function(data) { 
  		$scope.mails = data;
  	});

  	$scope.changeSorting = function(column) {
        var sort = $scope.sort;
        if (sort.column == column) {
            sort.descending = !sort.descending;
        } else {
            sort.column = column;
            sort.descending = false;
        }
    };

    $scope.openMail = function(messageID) {

    };
  });
