angular.module('templates-webshop', ['webshop-dummy.tpl.html']);

angular.module("webshop-dummy.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("webshop-dummy.tpl.html",
    "");
}]);

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
(function() {
    'use strict';

    var module = angular.module('webshop', [
        'ngResource',
        'webshop-dummy',
        'templates-webshop'
    ]);

}());