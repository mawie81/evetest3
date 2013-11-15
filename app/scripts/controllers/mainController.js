'use strict';

angular.module('evetest3App')
  .controller('MainCtrl', function ($scope, testService) {
    testService.getThings().success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
    testService.eveTest().success(function(data) {
    	$scope.eve = data;
    });

  });
