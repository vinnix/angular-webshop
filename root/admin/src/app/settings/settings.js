angular.module( 'admin.settings', [
    'ngResource',
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

    $scope.message = "Voit vaihtaa salasanasi kirjoittamalla nykyisen salasanasi ja uuden salasanan kahdesti allaoleviin kenttiin.";
    $scope.oldpassword = null;
    $scope.newpassword1 = null;
    $scope.newpassword2 = null;

    var changepassword = function() {

        Setting.save({
            "oldpassword": $scope.oldpassword,
            "newpassword1": $scope.newpassword1,
            "newpassword2": $scope.newpassword2
        }).$promise.then(function(x) {
            $scope.message = "Salasanan vaihtaminen onnistui!";
            $scope.oldpassword = null;
            $scope.newpassword1 = null;
            $scope.newpassword2 = null;
        }, function(error) {
            console.log(error.status);
            if (error.status === 403) {
               $rootScope.$emit('logout', 1);
            } else {
                $scope.message = "Salasanan vaihtaminen epäonnistui.";
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
