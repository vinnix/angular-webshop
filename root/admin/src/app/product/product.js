angular.module( 'admin.product', [
    'ui.router',
    'admin.product.categories',
    'admin.product.images',
    'admin.product.editor',
    'admin.product.title',
    'admin.product.hidden'
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

.controller('ProductCtrl', function ProductCtrl($scope, $rootScope, Product, removeobject) {
    var productlist = function() {
        Product.get().$promise.then(function(x) {
            $scope.products = x.products;
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

    $scope.create = function() {
        Product.save({
            "title": $scope.newtitle
        }).$promise.then(function(success) {
            $scope.products.push(success);
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

    productlist();

})

;
