angular.module('templates-webshop', ['webshop-add-to-cart.tpl.html', 'webshop-cart.tpl.html', 'webshop-dummy.tpl.html', 'webshop-image.tpl.html', 'webshop-product-description.tpl.html', 'webshop-product-list.tpl.html']);

angular.module("webshop-add-to-cart.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("webshop-add-to-cart.tpl.html",
    "<button ng-click=\"addToCart(product)\">Add to cart</button>");
}]);

angular.module("webshop-cart.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("webshop-cart.tpl.html",
    "<h2>Cart</h2>\n" +
    "\n" +
    "<p ng-show=\"emptyCart\">Cart is empty</p>\n" +
    "\n" +
    "<ul>\n" +
    "    <li ng-repeat=\"item in cart | orderBy:'title':false\">\n" +
    "        <a ng-href=\"{{ productPage + '/' + item.product.id }}\">{{ item.product.title }}</a>\n" +
    "        {{ item.count }}\n" +
    "        <button ng-click=\"decrementCart(item.product)\">-</button>\n" +
    "        <button ng-click=\"incrementCart(item.product)\">+</button>\n" +
    "        <button ng-click=\"removeFromCart(item.product)\">Remove</button>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("webshop-dummy.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("webshop-dummy.tpl.html",
    "");
}]);

angular.module("webshop-image.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("webshop-image.tpl.html",
    "<img ng-if=\"image\" ng-src=\"{{ image }}\" ng-class=\"imgClass\">");
}]);

angular.module("webshop-product-description.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("webshop-product-description.tpl.html",
    "<h2>{{ product.title }}</h2>\n" +
    "\n" +
    "<p><webshop-image id=\"{{ product.main_image }}\"></webshop-image></p>\n" +
    "\n" +
    "<p ng-bind-html=\"product.description\"></p>\n" +
    "\n" +
    "<p><webshop-add-to-cart product=\"product\"></webshop-add-to-cart></p>");
}]);

angular.module("webshop-product-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("webshop-product-list.tpl.html",
    "<h2>Products</h2>\n" +
    "\n" +
    "<ul>\n" +
    "    <li ng-repeat=\"product in products | orderBy:'title':false\"><a ng-href=\"{{ productPage + '/' + product.id }}\">{{ product.title }}</a></li>\n" +
    "</ul>\n" +
    "");
}]);
