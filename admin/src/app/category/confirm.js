angular.module( 'Admin.category.confirm', [
])

.controller('ConfirmCategoryCtrl', function ($scope, $modalInstance, category) {
    $scope.category = category;

    $scope.ok = function () {
        $modalInstance.close($scope.category);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
})

;