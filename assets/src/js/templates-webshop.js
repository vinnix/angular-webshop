angular.module('templates-webshop', ['webshop-dummy.tpl.html', 'webshop-product-description.tpl.html', 'webshop-product-list.tpl.html']);

angular.module("webshop-dummy.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("webshop-dummy.tpl.html",
    "");
}]);

angular.module("webshop-product-description.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("webshop-product-description.tpl.html",
    "<h2>{{ product.title }}</h2>\n" +
    "\n" +
    "<p ng-bind-html=\"product.description\"></p>");
}]);

angular.module("webshop-product-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("webshop-product-list.tpl.html",
    "<h2>Products</h2>\n" +
    "\n" +
    "<ul>\n" +
    "    <li ng-repeat=\"product in products\"><a ng-href=\"{{ productPage + '/' + product.id }}\">{{ product.title }}</a></li>\n" +
    "</ul>\n" +
    "");
}]);
