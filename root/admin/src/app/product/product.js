angular.module( 'admin.product', [
    'ui.router',
    'admin.product.categories',
    'admin.product.images',
    'admin.product.editor',
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

.controller('ProductCtrl', function ProductCtrl($scope, $filter, $rootScope, Product, removeobject) {
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.predicate = 'id';
    $scope.reverse = false;
    $scope.search = null;

    var productlist = function() {
        Product.get().$promise.then(function(x) {
            $scope.allProducts = $filter('orderBy')(x.products, $scope.predicate, $scope.reverse);
            $scope.filteredProducts = $scope.allProducts;
            $scope.totalItems = x.products.length;
            $scope.currentPage = 1;
            pageChanged();
        }, function(error) {
            if (error.status === 403) {
               $rootScope.$emit('logout', 1);
            }
        });
    };

    $scope.remove = function(id) {
        var retVal = confirm("Oletko varma että haluat poistaa tuotteen "+id+"?");
        if (retVal === true) {
            Product.remove({ "id":id }).$promise.then(function(x) {
                if (x.message == 'OK') {
                    $scope.products = removeobject($scope.products, id);
                }
            }, function(error) {
                if (error.status === 403) {
                   $rootScope.$emit('logout', 1);
                } else {
                    console.log("Error:",error.status);
                }
            });
            return true;
        } else {
            return false;
        }
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
            $scope.allProducts.push(success);
            $scope.newtitle = null;
            $scope.error = false;
        }, function(error) {
            if (error.status === 403) {
               $rootScope.$emit('logout', 1);
            } else if (error.status === 404) {
                $scope.error = true;
                alert("Error! Check missing fields.");
            } else {
                console.log("Error:",error.status);
            }
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
            $scope.filteredProducts = $filter('filter')($scope.allProducts, newvalue);
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

    productlist();

})

;
