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