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
      },
      getCharIDs: function() {
        return $http.get('api/charIDsAndName');
      },
      itemSearch: function(name) {
         return $http.get('api/itemsearch/' + name).then(function(response) {
            return response.data;
         });
      },
      stationSearch: function(name) {
         return $http.get('api/stationsearch/' + name).then(function(response) {
            return response.data;
         });
      },
      fetchprices: function(stationID, typeIDs) {
        return $http.get('api/fetchprices?station=' + stationID + '&typeIDs=' + typeIDs.join());
      }
    };
  });
