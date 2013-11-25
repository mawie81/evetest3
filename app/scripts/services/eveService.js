'use strict';

angular.module('evetest3App')
  .factory('eveService', function ($http) {
    // Service logic
    // ...


    // Public API here
    return {
      getChars: function() {
        return $http.get('api/chars');
      },
      getOrders: function(charId) {
        return $http.get('api/orders/' + charId);
      },
      getTransactions: function(charId) {
        return $http.get('api/transactions/' + charId);
      },
      getJournal: function(charId) {
        return $http.get('api/journal/' + charId + '/' + '50');
      }
    };
  });
