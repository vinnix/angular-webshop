angular.module( 'admin.product.editor', [
    'wysiwyg.module'
])

.directive('productEditor', function() {
    return {
        restrict: 'E',
        template: '<button class="btn btn-default" ng-click="open()"><i class="fa fa-edit"></i></button>',
        scope: {
            'product': '='
        },
        controller: function($scope, $modal) {
            $scope.open = function() {
                var modalInstance = $modal.open({
                    templateUrl: 'product/editor.tpl.html',
                    controller: 'EditorCtrl',
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

.controller('EditorCtrl', function ($scope, $modalInstance, $rootScope, product, Product) {
    Product.get({
        "id": product.id
    }).$promise.then(function(success) {
        $scope.edit = success;
    });

    $scope.save = function() {
        Product.save({
            "id": product.id,
            "title": $scope.edit.title,
            "description": $scope.edit.description
        }).$promise.then(function(success) {
            $scope.edit = success;
        });
    };

    $scope.close = function () {
        $modalInstance.close();
    };
})

;