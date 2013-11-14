'use strict';

angular.module('evetest3App')
  .factory('testService', function ($http) {
    // Service logic
    // ...


    // Public API here
    return {
      getThings: function () {
        return $http.get('/api/awesomeThings');
      },
      getTest: function () {
        return $http.get('api/test');
      }
    };
  });
