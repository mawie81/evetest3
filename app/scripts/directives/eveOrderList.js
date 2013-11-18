'use strict';

angular.module('evetest3App')
  .directive('eveOrderList', function () {
    return {
      //templateUrl: 'templates/eveOrderList/eveOrderList.html',
      template: '<div>Test</div>'
      restrict: 'E',
     /* link: function postLink(scope, element, attrs) {
        element.text('this is the eveOrderList directive');
      }*/
     /* scope: {
      	orders: '='
      }*/)
    };
  });
