angular.module('templates-webshop', ['webshop-dummy.tpl.html']);

angular.module("webshop-dummy.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("webshop-dummy.tpl.html",
    "");
}]);
