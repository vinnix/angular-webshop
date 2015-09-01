angular.module( 'Admin.category.title', [
])

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

;