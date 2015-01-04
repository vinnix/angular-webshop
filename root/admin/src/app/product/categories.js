angular.module( 'admin.product.categories', [
	'admin.product.category'
])

.directive('productCategories', function() {
    return {
        restrict: 'E',
        template: '<button class="btn btn-default" ng-click="open()" title="Kategorioiden valinta"><i class="fa fa-tag"></i></button>',
        scope: {
            'product': '='
        },
        controller: function($scope, $modal) {
            $scope.open = function() {
                var modalInstance = $modal.open({
                    templateUrl: 'product/categories.tpl.html',
                    controller: 'CategoriesCtrl',
                    size: 'lg',
                    resolve: {
                        product: function () {
                            return $scope.product;
                        }
                    }
                });
            };
        }
    };
})

.controller('CategoriesCtrl', function ($scope, $modalInstance, $rootScope, product, Category, removeobject) {
    $scope.product = product;
    Category.get().$promise.then(function(success) {
        $scope.categories = success.categories;
    });

    $scope.close = function () {
        $modalInstance.close();
    };

    $rootScope.$on('removecategory', function(e, id) {
        if (id > 0) {
            $scope.categories = removeobject($scope.categories, id);
        }
    });
})

;