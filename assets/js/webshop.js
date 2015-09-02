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

    var module = angular.module('webshop-factory-cart', [
    ]);

    module.factory('Cart', function() {
        var service = {};
        var _cart = {};

        service.add = function(product) {
            if (product && product.id) {
                if (!_cart[product.id]) {
                    _cart[product.id] = {
                        item: product,
                        count: 0
                    };
                    _cart[product.id][count] =  _cart[product.id][count] + 1;
                }
            }
        };

        service.remove = function(product) {
            if (product && product.id) {
                _cart[product.id] = undefined;
            }
        };

        return service;
    });

}());

(function() {
    'use strict';

    var module = angular.module('webshop-factory-rest', [
        'ngResource'
    ]);

    module.factory('Product', ['$resource', 'Config', function($resource, Config) {
        return $resource(Config.backend + '/product/:id', {
            id:'@id'
        });
    }]);

    module.factory('ProductImages', ['$resource', 'Config', function($resource, Config) {
        return $resource(Config.backend + '/product/:product/images/:image', {
            product:'@product',
            image:'@image'
        });
    }]);

    module.factory('ProductCategories', ['$resource', 'Config', function($resource, Config) {
        return $resource(Config.backend + '/product/:product/categories/:category', {
            product:'@product',
            category:'@category'
        });
    }]);

}());

(function() {
    'use strict';

    var module = angular.module('webshop-product-description', [
    ]);

    module.directive('webshopProductDescription', ['Config', 'Product', function(Config, Product) {
        return {
            restrict: 'E',
            templateUrl: 'webshop-product-description.tpl.html',
            scope: {
                'productId': '@product',
            },
            controller: function($scope, $sce, Product) {
                var fetchProduct = function() {
                    Product.get({
                        id: $scope.productId
                    }).$promise.then(function(success) {
                        $scope.product = success;
                        $scope.product.description = $sce.trustAsHtml($scope.product.description);
                    });
                };

                $scope.$watch('productId', function(newValue, oldValue) {
                    if (newValue) {
                        fetchProduct();
                    }
                });
            }
        };
    }]);

}());
(function() {
    'use strict';

    var module = angular.module('webshop-product-list', [
    ]);

    module.directive('webshopProductList', ['Config', 'Product', function(Config, Product) {
        return {
            restrict: 'E',
            templateUrl: 'webshop-product-list.tpl.html',
            scope: {},
            controller: function($scope, Config, Product) {
                Product.get().$promise.then(function(success) {
                    $scope.products = success.products;
                });
                if (Config && Config.productPage) {
                    $scope.productPage = Config.productPage;
                } else {
                    $scope.productPage = '#!/product';
                }
            }
        };
    }]);

}());
(function() {
    'use strict';

    var module = angular.module('webshop', [
        'webshop-factory-cart',
        'webshop-factory-rest',
        'webshop-product-list',
        'webshop-product-description',
        'templates-webshop'
    ]);

}());