angular.module('templates-webshop', ['webshop-add-to-cart.tpl.html', 'webshop-cart.tpl.html', 'webshop-dummy.tpl.html', 'webshop-product-description.tpl.html', 'webshop-product-list.tpl.html']);

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

angular.module("webshop-product-description.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("webshop-product-description.tpl.html",
    "<h2>{{ product.title }}</h2>\n" +
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

(function() {
    'use strict';

    var module = angular.module('webshop-add-to-cart', [
    ]);

    module.directive('webshopAddToCart', ['Cart', function(Cart) {
        return {
            restrict: 'E',
            templateUrl: 'webshop-add-to-cart.tpl.html',
            scope: {
                'product': '=',
            },
            controller: function($scope, Cart) {
                $scope.addToCart = function(product) {
                    Cart.add(product);
                };
            }
        };
    }]);

}());
(function() {
    'use strict';

    var module = angular.module('webshop-cart', [
    ]);

    module.directive('webshopCart', ['$rootScope', 'Cart', function($rootScope, Cart) {
        return {
            restrict: 'E',
            templateUrl: 'webshop-cart.tpl.html',
            scope: {},
            controller: function($scope, $rootScope, Cart) {
                var checkCart = function() {
                    $scope.cart = Cart.list();
                    $scope.emptyCart = Cart.isCartEmpty();
                };

                $scope.decrementCart = function(product) {
                    Cart.decrement(product);
                };

                $scope.incrementCart = function(product) {
                    Cart.increment(product);
                };

                $scope.removeFromCart = function(product) {
                    Cart.remove(product);
                };

                $rootScope.$on('cartUpdated', function() {
                    checkCart();
                });

                checkCart();
            }
        };
    }]);

}());
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
        'LocalStorageModule'
    ]);

    module.factory('Cart', ['$rootScope', 'localStorageService', function($rootScope, localStorageService) {
        var service = {};
        var _cart = {};

        var _loadCart = function() {
            var cartTmp = localStorageService.get('cart');
            if (cartTmp) {
                _cart = cartTmp;
            }
        };

        var _saveCart = function() {
            localStorageService.set('cart', _cart);
        };

        var _initializeItem = function(product) {
            _cart[product.id] = {
                product: product,
                count: 0
            };
        };

        var _decrement = function(product) {
            _cart[product.id].count = _cart[product.id].count - 1;
        };

        var _increment = function(product) {
            _cart[product.id].count = _cart[product.id].count + 1;
        };

        var _signalUpdated = function() {
            $rootScope.$emit('cartUpdated', 1);
        };

        service.add = function(product) {
            if (product && product.id) {
                _loadCart();
                if (!_cart[product.id]) {
                    _initializeItem(product);
                }
                _increment(product);
                _saveCart();
                _signalUpdated();
            }
        };

        service.decrement = function(product) {
            if (product && product.id && _cart[product.id]) {
                _loadCart();
                if (_cart[product.id].count == 1) {
                    delete _cart[product.id];
                } else {
                    _decrement(product);
                }
                _saveCart();
                _signalUpdated();
            }

        };

        service.increment = function(product) {
            if (product && product.id && _cart[product.id]) {
                _loadCart();
                _increment(product);
                _saveCart();
                _signalUpdated();
            }

        };

        service.remove = function(product) {
            if (product && product.id) {
                _loadCart();
                delete _cart[product.id];
                _saveCart();
                _signalUpdated();
            }
        };

        service.isCartEmpty = function() {
            for (var prop in _cart) {
                if (_cart.hasOwnProperty(prop)) {
                    return false;
                }
            }
            return true;
        };

        service.list = function() {
            _loadCart();
            return _cart;
        };

        return service;
    }]);

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
        'webshop-cart',
        'webshop-add-to-cart',
        'templates-webshop'
    ]);

}());