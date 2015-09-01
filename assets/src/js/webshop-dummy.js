(function() {
    'use strict';

    var module = angular.module('webshop-dummy', [
    ]);

    module.directive("webshopDummy", [
        "$rootScope",
        "$window",
        "$filter",
        "$timeout",
        "$interval",
        "$resource",
        function($rootScope, $window, $filter, $timeout, $interval, $resource) {
            return {
                restrict: 'E',
                templateUrl: 'webshop-dummy.tpl.html',
                scope: {},
                link: function(scope, element, attrs) {

                }
            };
        }
    ]);

}());