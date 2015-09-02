angular.module( 'Admin.product.editor', [
    'wysiwyg.module'
])

.controller('ProductEditorCtrl', function ($scope, $modalInstance, $rootScope, product, Product) {
    Product.get({
        "id": product.id
    }).$promise.then(function(success) {
        $scope.product = success;
    });

    $scope.ok = function () {
        $modalInstance.close($scope.product);
    };

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
})

;