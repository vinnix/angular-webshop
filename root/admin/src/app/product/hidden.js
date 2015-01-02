angular.module( 'admin.product.hidden', [
])

.directive('productHidden', function() {
    return {
        restrict: 'E',
        templateUrl: 'product/hidden.tpl.html',
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

;