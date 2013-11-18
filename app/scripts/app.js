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
     
      .when('/char/:charId', {
        templateUrl: 'views/char.html',
        controller: 'CharCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
