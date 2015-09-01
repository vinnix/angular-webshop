angular.module( 'admin.category.position', [
])

.directive('categoryPosition', function() {
    return {
        restrict: 'E',
        templateUrl: 'category/position.tpl.html',
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

;