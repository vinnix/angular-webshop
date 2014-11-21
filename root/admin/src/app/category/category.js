angular.module( 'admin.category', [
    'ngResource',
    'ui.router',
    'ui.bootstrap'
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

.controller('CategoryCtrl', function CategoryCtrl($scope, $rootScope, Category) {

    $scope.disable = false;
    $scope.categories = [];
    $scope.count = 0;

    var fetchcategories = function() {
        Category.get().$promise.then(function(success) {
            $scope.categories = success.categories;
            $scope.count = success.categories.length;
        },function(error) {
            console.log(error);
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
            $scope.error = true;
            alert("Error! Check missing field.");
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

.directive('categoryPosition', function() {
    return {
        restrict: 'E',
        template: '<select ng-model="selected" ng-options="counter as counter for counter in counters" ng-change="reorder()" ng-disabled="disabled"></select>',
        scope: {
            'category': '=category',
            'count': '=count'
        },
        controller: function($scope, $rootScope, CategoryPosition) {
            var recalculate = function(count_str) {
                $scope.counters = [];
                var count = parseInt(count_str, 10);
                for (i = 1; i <= count; i++) {
                    $scope.counters.push(i);
                }
                $scope.selected = parseInt($scope.category.position, 10);
            };

            $scope.reorder = function(counter) {
                CategoryPosition.save({
                    id: $scope.category.id,
                    position: $scope.selected
                }).$promise.then(function(success) {
                    $rootScope.$emit('reorder', 1);
                },function(error) {
                    console.log(error);
                });
            };

            $rootScope.$on('recalculate', function(x, id, count) {
                recalculate(count);
            });

            $rootScope.$on('disableopen', function() {
                $scope.disabled = true;
            });

            $rootScope.$on('enableopen', function() {
                $scope.disabled = false;
            });

            recalculate($scope.count);
        }
    };
})

.directive('categoryTitle', function() {
    return {
        restrict: 'E',
        templateUrl: 'category/title.tpl.html',
        scope: {
            'category': '=category'
        },
        controller: function($scope, Category) {
            $scope.title = $scope.category.title;
            $scope.show = function() {
                $scope.edit = $scope.category.title;
            };

            $scope.save = function() {
                Category.save({
                    "id": $scope.category.id,
                    "title": $scope.edit
                }).$promise.then(function(success) {
                    //console.log(success);
                },function(error) {
                    console.log("ERROR!!!");
                    // Error
                });
                $scope.category.title = $scope.edit;
                $scope.title = $scope.edit;
                $scope.edit = false;
            };
        }
    };
})

.directive('categoryRemove', function() {
    return {
        restrict: 'E',
        template: '<button ng-click="remove()"><i class="fa fa-trash-o"></i> Poista</button>',
        scope: {
            'category': '=category'
        },
        controller: function($scope, $rootScope, Category) {
            $scope.remove = function() {
                Category.remove({
                    "id": $scope.category.id
                }).$promise.then(function(success) {
                    $rootScope.$emit('removeMeFromCategories', $scope.category.id);
                },function(error) {
                    console.log("ERROR!!!");
                    // Error
                });
            };

        }
    };
})

;
