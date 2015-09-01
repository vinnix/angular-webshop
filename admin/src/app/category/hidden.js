angular.module( 'admin.category.hidden', [
])

.directive('categoryHidden', function() {
    return {
        restrict: 'E',
        templateUrl: 'category/hidden.tpl.html',
        scope: {
            'category': '='
        },
        controller: function($scope, Category, removeobject) {
            $scope.toggle = function() {
                if ($scope.category.hidden == 1) {
                    $scope.category.hidden = 0;
                } else {
                    $scope.category.hidden = 1;
                }
                Category.save({
                    "id": $scope.category.id,
                    "hidden": $scope.category.hidden
                }).$promise.then(function(success) {
                    //console.log(success);
                },function(error) {
                    console.log("ERROR!!!");
                    // Error
                });
            };

            $scope.$watch('category.hidden', function() {
                if ($scope.category.hidden == 1) {
                    $scope.code = "fa-toggle-off";
                } else {
                    $scope.code = "fa-toggle-on";
                }
            });
        }
    };
})

;