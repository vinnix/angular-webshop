angular.module( 'admin.product.category', [
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