angular.module( 'admin.product', [
    'ui.router',
    'JSONedit',
    'flow'
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
        var retVal = confirm("Oletko varma että haluat poistaa työn "+id+"?");
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

.directive('productHidden', function() {
    return {
        restrict: 'E',
        template: '<button ng-click="toggle()"><i class="fa" ng-class="code"></i></button>',
        scope: {
            'product': '='
        },
        controller: function($scope, Product, removeobject) {
            $scope.toggle = function() {
                if ($scope.product.hidden == 1) {
                    $scope.product.hidden = 0;
                } else {
                    $scope.product.hidden = 1;
                }
                Product.save({
                    "id": $scope.product.id,
                    "hidden": $scope.product.hidden
                }).$promise.then(function(success) {
                    //console.log(success);
                },function(error) {
                    console.log("ERROR!!!");
                    // Error
                });
            };

            $scope.$watch('product.hidden', function() {
                if ($scope.product.hidden == 1) {
                    $scope.code = "fa-toggle-off";
                } else {
                    $scope.code = "fa-toggle-on";
                }
            });
        }
    };
})

.directive('productTitle', function() {
    return {
        restrict: 'E',
        templateUrl: 'product/title.tpl.html',
        scope: {
            'product': '='
        },
        controller: function($scope, Product, removeobject) {

            $scope.title = $scope.product.title;
            $scope.show = function() {
                $scope.edit = $scope.product.title;
            };

            $scope.save = function() {
                Product.save({
                    "id": $scope.product.id,
                    "title": $scope.edit
                }).$promise.then(function(success) {
                    //console.log(success);
                },function(error) {
                    console.log("ERROR!!!");
                    // Error
                });
                $scope.product.title = $scope.edit;
                $scope.title = $scope.edit;
                $scope.edit = false;
            };

        }
    };
})

.directive('productEditor', function() {
    return {
        restrict: 'E',
        templateUrl: 'product/editor.tpl.html',
        scope: {
            'product': '='
        },
        controller: function($scope, Product, removeobject) {

            $scope.show = function() {
                Product.get({
                    "id": $scope.product.id
                }).$promise.then(function(success) {
                    $scope.edit = success.payload;
                },function(error) {
                    console.log("ERROR!!!");
                    // Error
                });
            };

            $scope.save = function() {
                Product.save({
                    "id": $scope.product.id,
                    "payload": $scope.edit
                }).$promise.then(function(success) {
                    //console.log(success);
                },function(error) {
                    console.log("ERROR!!!");
                    // Error
                });
                $scope.edit = false;
            };

            $scope.close = function() {
                $scope.edit = false;
            };
        }
    };
})

.directive('productImages', function() {
    return {
        restrict: 'E',
        templateUrl: 'product/images.tpl.html',
        scope: {
            'product': '='
        },
        controller: function($scope, $rootScope, ProductImages, removeobject, containsid) {
            $scope.edit = false;
            $scope.show = function() {
                $scope.edit = true;
                $scope.images = [];
                ProductImages.get({
                    "product": $scope.product.id
                }).$promise.then(function(success) {
                    $scope.images = $scope.images.concat(success.images);
                },function(error) {
                    // Error
                });
            };

            $scope.success = function(x) {
                var image = JSON.parse(x);
                ProductImages.save({
                    "product": $scope.product.id,
                    "newimage": image.id
                }).$promise.then(function(success) {
                    if (!containsid(success.id, $scope.images)) {
                        $scope.images.push(success);
                    }
                },function(error) {
                    console.log("ERROR!!!");
                    // Error
                });
            };

            $scope.close = function() {
                $scope.images = null;
                $scope.edit = false;
            };

            $rootScope.$on('removeimage', function(e, id) {
                if (id > 0) {
                    $scope.images = removeobject($scope.images, id);
                }
            });
        }
    };
})

.directive('showImage', function() {
    return {
        restrict: 'E',
        templateUrl: 'product/image.tpl.html',
        scope: {
            'product': '=',
            'image': '='
        },
        controller: function($scope, $rootScope, ProductImages) {
            $scope.style = {
                'background-image': 'url('+$scope.image.link+')'
            };

            $scope.remove = function() {
                ProductImages.remove({
                    "product": $scope.product.id,
                    "image": $scope.image.id
                }).$promise.then(function(success) {
                    $rootScope.$emit('removeimage', $scope.image.id);
                },function(error) {
                    // Error
                });
            };

            $scope.main = function() {
                ProductImages.save({
                    "product": $scope.product.id,
                    "image": $scope.image.id
                }).$promise.then(function(success) {
                    $rootScope.$emit('newmainimage', $scope.image.id);
                    $scope.image.is_main = true;
                },function(error) {
                    // Error
                });
            };

            $rootScope.$on('newmainimage', function(e, id) {
                if (id && id != $scope.image.id) {
                    $scope.image.is_main = false;
                }
            });
        }
    };
})

.directive('productCategories', function() {
    return {
        restrict: 'E',
        templateUrl: 'product/categories.tpl.html',
        scope: {
            'product': '='
        },
        controller: function($scope, $rootScope, Category, removeobject) {
            $scope.edit = false;
            $scope.show = function() {
                $scope.edit = true;
                $scope.categories = [];
                Category.get().$promise.then(function(success) {
                    $scope.categories = $scope.categories.concat(success.categories);
                },function(error) {
                    // Error
                });
            };

            $scope.close = function() {
                $scope.categories = null;
                $scope.edit = false;
            };

            $rootScope.$on('removecategory', function(e, id) {
                if (id > 0) {
                    $scope.categories = removeobject($scope.categories, id);
                }
            });
        }
    };
})

.directive('checkCategory', function() {
    return {
        restrict: 'E',
        templateUrl: 'product/category.tpl.html',
        scope: {
            'product': '=',
            'category': '='
        },
        controller: function($scope, $rootScope, ProductCategories) {
            ProductCategories.get({
                "product": $scope.product.id,
                "category": $scope.category.id
            }).$promise.then(function(success) {
                $scope.enabled = true;
            },function(error) {
                $scope.enabled = false;
            });

            $scope.toggle = function() {
                if ($scope.enabled === true) {
                    ProductCategories.save({
                        "product": $scope.product.id,
                        "newcategory": $scope.category.id
                    }).$promise.then(function(success) {
                        // Now it's saved
                    }, function(error) {
                        console.log ("ERROR:",error);
                    });
                } else {
                    ProductCategories.remove({
                        "product": $scope.product.id,
                        "category": $scope.category.id
                    }).$promise.then(function(success) {
                        // Now it's saved
                    }, function(error) {
                        console.log ("ERROR:",error);
                    });
                }
            };
        }
    };
})

;
