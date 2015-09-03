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