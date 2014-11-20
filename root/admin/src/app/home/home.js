angular.module( 'admin.home', [
    'ui.router',
    'ui.bootstrap'
])

.config(function config( $stateProvider ) {
    $stateProvider.state( 'home', {
        url: '/home',
        views: {
            "main": {
                controller: 'HomeCtrl',
                templateUrl: 'home/home.tpl.html'
            }
        },
        data: {
            pageTitle: 'Home'
        }
    });
})

.controller( 'HomeCtrl', function HomeCtrl( $scope ) {
})

;

