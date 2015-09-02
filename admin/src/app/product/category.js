angular.module( 'Admin.product.category', [
])

.directive('checkCategory', function() {
    return {
        restrict: 'E',
        templateUrl: 'product/category.tpl.html',
        scope: {
            'product': '=',
            'category': '='
        },
        controller: function($scope, $rootScope, ProductCategories) {
            var checkProductCategory = function() {
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
                        });
                    } else {
                        ProductCategories.remove({
                            "product": $scope.product.id,
                            "category": $scope.category.id
                        });
                    }
                };
            };

            $scope.$watchGroup(['product', 'category'], function(newValue, oldValue) {
                if (newValue[0] && newValue[1]) {
                    checkProductCategory();
                }
            });

        }
    };
})

;