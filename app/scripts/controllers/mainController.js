'use strict';

angular.module('evetest3App')
  .controller('MainCtrl', function ($scope, eveService) {
    eveService.getChars().success(function(data) {
    	$scope.eve = data;
    });
  });
