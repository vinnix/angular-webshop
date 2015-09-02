angular.module( 'Admin.product', [
    'ui.router',
    'Admin.product.editor',
    'Admin.product.confirm',
    'ui.bootstrap.pagination'
])

.config(function config($stateProvider) {
    $stateProvider.state( 'product', {
        url: '/product',
        views: {
            "main": {
                controller: 'ProductCtrl',
                templateUrl: 'product/product.tpl.html'
            }
        },
        data: {
            pageTitle: 'Products'
        }
    });
})

.controller('ProductCtrl', function ProductCtrl($scope, $modal, $filter, $rootScope, Product, removeobject) {
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.predicate = 'id';
    $scope.reverse = false;
    $scope.search = null;

    var fetchproducts = function() {
        Product.get().$promise.then(function(success) {
            $scope.allProducts = $filter('orderBy')(success.products, $scope.predicate, $scope.reverse);
            $scope.filteredProducts = $scope.allProducts;
            $scope.totalItems = $scope.filteredProducts.length;
            $scope.currentPage = 1;
            pageChanged();
        }, function(error) {
            if (error.status === 403) {
               $rootScope.$emit('logout', 1);
            }
        });
    };

    $scope.remove = function(product, index) {
        var modalInstance = $modal.open({
            templateUrl: 'product/confirm.tpl.html',
            controller: 'ConfirmProductCtrl',
            size: 'lg',
            resolve: {
                product: function () {
                    return product;
                }
            }
        });
        modalInstance.result.then(function(product) {
            Product.remove({
                "id": product.id
            }).$promise.then(function(success) {
                fetchproducts();
            });
        });
    };

    $scope.edit = function(product, index) {
        var modalInstance = $modal.open({
            templateUrl: 'product/editor.tpl.html',
            controller: 'ProductEditorCtrl',
            size: 'lg',
            resolve: {
                product: function () {
                    return product;
                }
            }
        });
        modalInstance.result.then(function(product) {
            Product.save({
                "id": product.id,
                "title": product.title,
                "description": product.description
            }).$promise.then(function(success) {
                fetchproducts();
            });
        });
    };

    $scope.hidden = function(product) {
        Product.save({
            "id": product.id,
            "hidden": product.hidden
        }).$promise.then(function(success) {
            //console.log(success);
        });
    };

    $scope.create = function() {
        Product.save({
            "title": $scope.newtitle
        }).$promise.then(function(success) {
            $scope.newtitle = null;
            $scope.error = false;
            fetchproducts();
        });
    };

    var pageChanged = function() {
        if ($scope.filteredProducts) {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                end = begin + $scope.itemsPerPage;
            $scope.products = $scope.filteredProducts.slice(begin, end);
        }
    };

    $scope.$watch('search', function(newvalue, oldvalue) {
        if (newvalue) {
            $scope.filteredProducts = $filter('filter')($scope.allProducts, $scope.search);
            $scope.currentPage = 1;
            $scope.totalItems = $scope.filteredProducts.length;
        }
    });

    $scope.$watch('currentPage', function(newvalue, oldvalue) {
        if (newvalue) {
            pageChanged();
        }
    });

    $scope.$watch('filteredProducts', function(newvalue, oldvalue) {
        if (newvalue) {
            pageChanged();
        }
    });

    $scope.$watch('predicate', function(newvalue, oldvalue) {
        if (newvalue) {
            $scope.filteredProducts = $filter('orderBy')($scope.filteredProducts, $scope.predicate, $scope.reverse);
            $scope.currentPage = 1;
            pageChanged();
        }
    });

    fetchproducts();

})

;
