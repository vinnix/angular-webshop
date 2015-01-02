angular.module( 'admin.product.images', [
	'admin.product.image',
    'flow'
])

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

;