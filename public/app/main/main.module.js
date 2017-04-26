'use strict';

var mainModule = angular
	.module('app.main', [
		'app.main.home',
		'app.main.abn'
	]);

mainModule.directive('scrollDown', ['$window', function ($window) {
  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs) {
      angular.element($window).bind("scroll", function() {
        if (this.pageYOffset > 50) {
           iElement.addClass('fixed-header');
        } else {
           iElement.removeClass('fixed-header');
        }
      });
    }
  };
}]);
