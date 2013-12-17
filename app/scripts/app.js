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
      .when('/pricecheck', {
        templateUrl: 'views/pricecheck.html',
        controller: 'PricecheckCtrl'
      })
      .when('/mail/:charId', {
        templateUrl: 'views/mail.html',
        controller: 'MailCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
