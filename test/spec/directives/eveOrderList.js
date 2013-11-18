'use strict';

describe('Directive: eveOrderList', function () {

  // load the directive's module
  beforeEach(module('evetest3App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<eve-order-list></eve-order-list>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the eveOrderList directive');
  }));
});
