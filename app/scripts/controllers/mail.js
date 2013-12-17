'use strict';

angular.module('evetest3App')
  .controller('MailCtrl', function ($scope, $routeParams, eveService) {
  	window.scope = $scope;
  	var charID = $routeParams.charId
  	eveService.getMail(charID).success(function(data) { 
  		$scope.mails = data;
  	});
  });
