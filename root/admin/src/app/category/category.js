angular.module( 'admin.category', [
    'ngResource',
    'ui.router',
    'admin.category.position',
    'admin.category.hidden',
    'admin.category.title'
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

.controller('CategoryCtrl', function CategoryCtrl($scope, $rootScope, Category, removeobject) {

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

    $scope.remove = function(id) {
        var retVal = confirm("Oletko varma että haluat poistaa tuoteryhmän "+id+"?");
        if (retVal === true) {
            Category.remove({ "id":id }).$promise.then(function(x) {
                if (x.message == 'OK') {
                    $scope.categories = removeobject($scope.categories, id);
                }
            }, function(error) {
                if (error.status === 403) {
                   $rootScope.$emit('logout', 1);
                } else {
                    console.log("Error:",error.status);
                }
            });
            return true;
        } else {
            return false;
        }
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
