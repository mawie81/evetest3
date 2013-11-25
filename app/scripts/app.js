'use strict';

angular.module('evetest3App', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
     
      .when('/orders/:charId', {
        templateUrl: 'views/orders.html',
        controller: 'OrdersCtrl'
      })
      .when('/transactions/:charId', {
        templateUrl: 'views/transactions.html',
        controller: 'TransactionsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
