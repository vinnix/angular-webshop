angular.module( 'Admin.product.editor', [
    'wysiwyg.module',
    'Admin.product.image',
    'Admin.product.category',
    'cloudinary-image',
    'flow'
])

.controller('ProductEditorCtrl', function ($scope, $modalInstance, $rootScope, product, Product, ProductImages, Category, removeobject) {
    Category.get().$promise.then(function(success) {
        $scope.categories = success.categories;
    });

    Product.get({
        "id": product.id
    }).$promise.then(function(success) {
        $scope.product = success;
        var fetchImages = function() {
            ProductImages.get({
                "product": $scope.product.id
            }).$promise.then(function(success) {
                $scope.images = success.images;
            });
        };

        $scope.imageUploadSuccess = function(success) {
            var image = JSON.parse(success);
            ProductImages.save({
                "product": $scope.product.id,
                "newimage": image.id
            }).$promise.then(function(success) {
                fetchImages();
            });
        };

        $rootScope.$on('removeimage', function(e, id) {
            if (id > 0) {
                $scope.images = removeobject($scope.images, id);
            }
        });

        $rootScope.$on('removecategory', function(e, id) {
            if (id > 0) {
                $scope.categories = removeobject($scope.categories, id);
            }
        });

        fetchImages();
    });

    $scope.ok = function () {
        $modalInstance.close($scope.product);
    };

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };

})

;