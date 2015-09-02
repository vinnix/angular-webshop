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
