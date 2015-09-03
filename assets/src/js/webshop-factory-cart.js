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
