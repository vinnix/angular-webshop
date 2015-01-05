angular.module( 'admin.product.images', [
	'admin.product.image',
    'flow',
    'cloudinary-image',
    'ui.bootstrap.modal'
])

.directive('productImages', function() {
    return {
        restrict: 'E',
        template: '<button class="btn" ng-class="btnClass" ng-click="open()"><i class="fa fa-photo"></i></button>',
        scope: {
            'product': '='
        },
        controller: function($scope, $modal, $log ) {
            $scope.btnClass = 'btn-default';
            $scope.open = function() {
                var modalInstance = $modal.open({
                    templateUrl: 'product/images.tpl.html',
                    controller: 'ImagesCtrl',
                    size: 'lg',
                    resolve: {
                        product: function () {
                            return $scope.product;
                        }
                    }
                });
            };
            $scope.$watch('product', function(newvalue, oldvalue) {
                if (newvalue) {
                    if ($scope.product.images.length === 0) {
                        $scope.btnClass = 'btn-warning';
                    }
                }
            });
        }
    };
})

.controller('ImagesCtrl', function ($scope, $modalInstance, $rootScope, product, containsid, removeobject, ProductImages) {
    $scope.product = product;
    $scope.progress = false;

    ProductImages.get({
        "product": $scope.product.id
    }).$promise.then(function(success) {
        $scope.images = success.images;
    });

    $scope.success = function(x) {
        var image = JSON.parse(x);
        ProductImages.save({
            "product": $scope.product.id,
            "newimage": image.id
        }).$promise.then(function(success) {
            if (!containsid(success.id, $scope.images)) {
                $scope.images.push(success);
            }
        });
    };

    $scope.close = function () {
        $modalInstance.close();
    };

    $rootScope.$on('removeimage', function(e, id) {
        if (id > 0) {
            $scope.images = removeobject($scope.images, id);
        }
    });
})

;