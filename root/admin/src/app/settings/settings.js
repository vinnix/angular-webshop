angular.module( 'admin.settings', [
    'ngResource',
    'ui.router',
    'ui.bootstrap'
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

    $scope.message = 'You can change your password by typing your current password and new password twice to the fields below.';
    $scope.oldpassword = null;
    $scope.newpassword1 = null;
    $scope.newpassword2 = null;

    var changepassword = function() {

        Setting.save({
            "oldpassword": $scope.oldpassword,
            "newpassword1": $scope.newpassword1,
            "newpassword2": $scope.newpassword2
        }).$promise.then(function(x) {
            $scope.message = "Password changing successful.";
            $scope.oldpassword = null;
            $scope.newpassword1 = null;
            $scope.newpassword2 = null;
        }, function(error) {
            console.log(error.status);
            if (error.status === 403) {
               $rootScope.$emit('logout', 1);
            } else {
                $scope.message = "Password changing failed.";
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
