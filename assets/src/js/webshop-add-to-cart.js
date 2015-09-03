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