angular.module( 'admin.siteuser', [
    'ui.router',
    'checklist-model'
])

.config(function config($stateProvider) {
    $stateProvider.state( 'siteuser', {
        url: '/siteuser',
        views: {
            "main": {
                controller: 'SiteuserCtrl',
                templateUrl: 'siteuser/siteuser.tpl.html'
            }
        },
        data: {
            pageTitle: 'Siteuser'
        }
    });
})

.controller('SiteuserCtrl', function SiteuserCtrl($scope, $rootScope, Siteuser, removeobject) {
    var siteuserlist = function() {
        $scope.siteusers = null;
        $scope.siteuser = null;
        Siteuser.get().$promise.then(function(x) {
            $scope.siteusers = x.siteusers;
            $scope.siteuser = $scope.siteusers[0].id;
        }, function(error) {
            console.log(error.status);
            if (error.status === 403) {
               $rootScope.$emit('logout', 1);
            }
        });
    };

    $scope.openuser = function() {
        $scope.mode = "Editing user information";
        Siteuser.get({
            id: $scope.siteuser
        }).$promise.then(function(x) {
            $scope.edit = x;
        }, function(error) {
            console.log(error.status);
            if (error.status === 403) {
               $rootScope.$emit('logout', 1);
            }
        });
    };

    $scope.removeuser = function() {
       var editid = $scope.edit.id;
        $scope.edit.$remove(function(x) {
            $scope.edit = null;
            $scope.mode = null;
        });
        if (editid > 0) {
            $scope.siteusers = removeobject($scope.siteusers, editid);
            $scope.siteuser = $scope.siteusers[0].id;
        }
    };

    $scope.createuser = function() {
        $scope.mode = "Creating new user";
        $scope.edit = new Siteuser();
    };

    $scope.saveuser = function() {
        if ($scope.edit.id) {
            $scope.siteusers = removeobject($scope.siteusers, $scope.edit.id);
        }
        $scope.edit.$save(function(x) {
            $scope.siteusers.push(x);
            $scope.siteuser = x.id;
        });
    };

    siteuserlist();

})

;
