angular.module( 'admin.login', [
    'ui.router',
    'ui.bootstrap'
])

.config(function config( $stateProvider ) {
    $stateProvider.state( 'login', {
        url: '/login/',
        views: {
            "main": {
                controller: 'LoginCtrl',
                templateUrl: 'login/login.tpl.html'
            }
        },
        data: {
            pageTitle: 'Login'
        }
    });
})

.controller( 'LoginCtrl', function LoginController( $scope, $rootScope, $state, Session, Auth ) {
    $scope.auth = Auth.status();

    var login = function() {
        Session.save({
            "username": $scope.username,
            "password": $scope.password
        }).$promise.then(function(success) {
            $scope.username = null;
            $scope.password = null;
            Auth.enable();
            $scope.auth = Auth.status();
            $rootScope.$emit('login', 1);
            $state.transitionTo('home');
        },function(error) {
            $scope.error = "Login unsuccessful!";
        });
    };

    $scope.login = function() {
        login();
    };

    // Enter key submits login form
    $scope.keyPressed = function(key) {
        if (key.keyCode == 13) {
            login();
        }
    };


})

;

