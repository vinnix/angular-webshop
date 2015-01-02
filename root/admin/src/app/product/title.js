angular.module( 'admin.product.title', [
])

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

;