angular.module( 'Admin.settings', [
    'ui.router'
])

.config(function config($stateProvider) {
    $stateProvider.state( 'settings', {
        url: '/settings',
        views: {
            "main": {
                controller: 'SettingsCtrl',
                templateUrl: 'settings/settings.tpl.html'
            }
        },
        data: {
            pageTitle: 'Settings'
        }
    });
})

.controller('SettingsCtrl', function SettingsCtrl($scope, Setting) {
    $scope.oldpassword = null;
    $scope.newpassword1 = null;
    $scope.newpassword2 = null;

    var changepassword = function() {
        Setting.update({
            "oldpassword": $scope.oldpassword,
            "newpassword1": $scope.newpassword1,
            "newpassword2": $scope.newpassword2
        }).$promise.then(function(x) {
            $scope.message = "Password change successful.";
            $scope.oldpassword = null;
            $scope.newpassword1 = null;
            $scope.newpassword2 = null;
        }, function(error) {
            console.log(error.status);
            if (error.status === 403) {
               $rootScope.$emit('logout', 1);
            } else {
                $scope.error = "Incorrect password, or passwords don't match.";
            }
        });
    };

    $scope.save = function() {
        changepassword();
    };

    // Enter key submits login form
    $scope.keyPressed = function(key) {
        if (key.keyCode == 13) {
            changepassword();
        }
    };

})

;
