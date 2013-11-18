'use strict';

angular.module('evetest3App')
  .directive('eveOrderList', function () {
    return {
      templateUrl: 'templates/eveOrderList/eveOrderList.html',
      //template: '<div>Test</div>',
      restrict: 'E',
      replace: true,
     /* transclude: true,
     link: function (scope, element, attrs) {
        element.append('<p>this is the eveOrderList directive</p>');
        console.log('eveOrderList');
      }*/
      scope: {
      	orders: '='
      }
    };
  });
