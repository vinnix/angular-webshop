angular.module( 'admin.product.image', [
])

.directive('showImage', function() {
    return {
        restrict: 'E',
        templateUrl: 'product/image.tpl.html',
        scope: {
            'product': '=',
            'image': '='
        },
        controller: function($scope, $rootScope, ProductImages) {
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

;