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