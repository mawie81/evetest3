'use strict';

angular.module('evetest3App')
  .factory('eveService', function ($http) {
    // Service logic
    // ...


    // Public API here
    return {
      getChars: function() {
        return $http.get('api/getChars');
      },
      getOrders: function(charId) {
        return $http.get('api/getOrders/' + charId);
      }
    };
  });
