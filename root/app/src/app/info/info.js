angular.module( 'app.info', [
    'ui.router'
])

.config(function config( $stateProvider ) {
    $stateProvider.state( 'info', {
        url: '/info',
        views: {
            "main": {
                controller: 'InfoCtrl',
                templateUrl: 'info/info.tpl.html'
            }
        },
        data: {
            pageTitle: 'Info'
        }
    });
})

.controller( 'InfoCtrl', function InfoCtrl( $scope ) {
})

;
