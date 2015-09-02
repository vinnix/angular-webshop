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