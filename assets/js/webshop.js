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

    module.factory('Image', ['$resource', 'Config', function($resource, Config) {
        return $resource(Config.backend + '/image/:id', {
            id:'@id'
        });
    }]);

}());

(function() {
    'use strict';

    var module = angular.module('webshop-image', [
    ]);

    module.directive('webshopImage', ['Image', function(Image) {
        return {
            restrict: 'E',
            templateUrl: 'webshop-image.tpl.html',
            scope: {
                'imageId': '@id'
            },
            controller: function( $scope, $attrs, $element, $window, Image ) {
                var default_width = 480,
                    default_height = 640;
                var fetchimage = function(id) {
                    Image.get({
                        id: id
                    }).$promise.then(function(success) {
                        if (success.cloudinary && success.cloudinary.cloud_name && success.cloudinary.public_id) {
                            var ratio = $window.devicePixelRatio ? $window.devicePixelRatio : 1,
                                format = $attrs.circle ? "png" : "jpg",
                                cloudname = success.cloudinary.cloud_name,
                                public_id = success.cloudinary.public_id,
                                width,
                                height;

                            if ($attrs.imgClass) {
                                $scope.imgClass = $attrs.imgClass;
                            }

                            if ($attrs.size === 'auto') {
                                width = $element.parent()[0].offsetParent.clientWidth ? Math.round($element.parent()[0].offsetParent.clientWidth) : 0;
                                height = $element.parent()[0].offsetParent.clientHeight ? Math.round($element.parent()[0].offsetParent.clientHeight) : 0;
                                if (width === 0 && height > 0) {
                                    width = height;
                                } else if (height === 0 && width > 0) {
                                    height = width;
                                } else if ($attrs.width > 0) {
                                    width = $attrs.width;
                                    if ($attrs.height > 0) {
                                        height = $attrs.height;
                                    } else {
                                        height = width;
                                    }
                                } else if (width === 0 && height === 0) {
                                    width = default_width;
                                    height = default_height;
                                }
                            } else {
                                width = $attrs.width ? $attrs.width : default_width;
                                height = $attrs.height ? $attrs.height : default_height;
                            }

                            width = width * ratio;
                            height = height * ratio;

                            var image_url = '//res.cloudinary.com/' + cloudname + '/image/upload/';
                            if ($attrs.circle) {
                                image_url = image_url +
                                    'w_' + width + ',h_' + width +
                                    ',c_thumb,r_max';
                            } else if ($attrs.square) {
                                image_url = image_url +
                                    'w_' + width + ',h_' + width +
                                    ',c_thumb';
                            } else {
                                image_url = image_url +
                                    'w_' + width + ',h_' + height +
                                    ',c_fill';
                            }
                            image_url = image_url + '/' + public_id + "." + format;
                            $scope.image = image_url;
                        } else {
                            $scope.image = "/assets/empty.png";
                        }
                    });
                };

                $scope.$watch('imageId', function(newValue, oldValue) {
                    if (newValue) {
                        console.log("Fetching",newValue);
                        fetchimage(newValue);
                    }
                });
            }
        };
    }]);

}());
(function() {
    'use strict';

    var module = angular.module('webshop-product-description', [
        'webshop-image',
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