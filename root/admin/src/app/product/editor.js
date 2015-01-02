angular.module( 'admin.product.editor', [
    'JSONedit'
])

.directive('productEditor', function() {
    return {
        restrict: 'E',
        templateUrl: 'product/editor.tpl.html',
        scope: {
            'product': '='
        },
        controller: function($scope, Product, removeobject) {

            $scope.show = function() {
                Product.get({
                    "id": $scope.product.id
                }).$promise.then(function(success) {
                    $scope.edit = success.payload;
                },function(error) {
                    console.log("ERROR!!!");
                    // Error
                });
            };

            $scope.save = function() {
                Product.save({
                    "id": $scope.product.id,
                    "payload": $scope.edit
                }).$promise.then(function(success) {
                    //console.log(success);
                },function(error) {
                    console.log("ERROR!!!");
                    // Error
                });
                $scope.edit = false;
            };

            $scope.close = function() {
                $scope.edit = false;
            };
        }
    };
})

;