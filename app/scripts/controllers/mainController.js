'use strict';

angular.module('evetest3App')
  .controller('MainCtrl', function ($scope, eveService) {
  	var skillsInTraining = {};

    eveService.getChars().success(function(data) {
    	$scope.eve = data;
    	/*for(var i = 0; i < data.length; i++) {
    		eveService.skillsInTraining(data[i].charId).success(function(skill) {
    			$scope.skillsInTraining[data[i].charId] = {
    				skillName: skill.skillName,
    				endTime: skill.endTime
    			}
    		});
    	}*/
    });

    $scope.getSkillNameInTraining = function(charId) {
    	if (skillsInTraining[charId] === null) return '';
    	return skillsInTraining[charId].skillName;
    }
  });
