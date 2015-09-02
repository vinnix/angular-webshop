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
