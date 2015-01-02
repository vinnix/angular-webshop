angular.module( 'admin.product.categories', [
	'admin.product.category'
])

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

;