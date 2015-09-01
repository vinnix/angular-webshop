angular.module( 'Admin.category', [
    'ngResource',
    'ui.router',
    'Admin.category.position',
    'Admin.category.hidden',
    'Admin.category.title',
    'Admin.category.confirm'
])

.config(function config($stateProvider) {
    $stateProvider.state( 'category', {
        url: '/category',
        views: {
            "main": {
                controller: 'CategoryCtrl',
                templateUrl: 'category/category.tpl.html'
            }
        },
        data: {
            pageTitle: 'Categories'
        }
    });
})

.controller('CategoryCtrl', function CategoryCtrl($scope, $modal, $rootScope, Category, removeobject) {

    $scope.disable = false;
    $scope.categories = [];
    $scope.count = 0;
    $scope.predicate = "position";
    $scope.reverse = false;

    var fetchcategories = function() {
        Category.get().$promise.then(function(success) {
            $scope.categories = success.categories;
            $scope.count = success.categories.length;
        },function(error) {
            console.log(error);
        });
    };

    $scope.remove = function(category) {
        var modalInstance = $modal.open({
            templateUrl: 'category/confirm.tpl.html',
            controller: 'ConfirmCategoryCtrl',
            size: 'lg',
            resolve: {
                category: function () {
                    return category;
                }
            }
        });
        modalInstance.result.then(function(category) {
            Category.remove({
                "id": category.id
            }).$promise.then(function(x) {
                if (x.message == 'OK') {
                    $scope.categories = removeobject($scope.categories, category.id);
                }
            });
        });
    };

    $scope.create = function() {
        Category.save({
            "title": $scope.newcategory
        }).$promise.then(function(success) {
            $scope.categories.push(success);
            $scope.count = $scope.count + 1;
            $rootScope.$emit('recalculate', 1, $scope.count);
        },function(error) {
            $scope.error = "Check missing fields!";
        });
        $scope.newcategory = null;
    };

    $rootScope.$on('reorder', function(x, id) {
        fetchcategories();
    });

    $rootScope.$on('removeMeFromCategories', function(x, id) {
        fetchcategories();
    });

    $rootScope.$on('disableopen', function() {
        $scope.disabled = true;
    });

    $rootScope.$on('enableopen', function() {
        $scope.disabled = false;
    });

    fetchcategories();

})

;
