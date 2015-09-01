angular.module( 'Admin.product.confirm', [
])

.controller('ConfirmProductCtrl', function ($scope, $modalInstance, product) {
    $scope.product = product;

    $scope.ok = function () {
        $modalInstance.close($scope.product);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
})

;