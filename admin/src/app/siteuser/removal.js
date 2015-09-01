angular.module( 'Admin.siteuser.removal', [
])

.controller('SiteuserRemovalCtrl', function ($scope, $modalInstance, siteuser) {
    $scope.siteuser = siteuser;

    $scope.ok = function () {
        $modalInstance.close($scope.siteuser);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
})

;
