angular.module( 'app', [
    'templates-app',
    'templates-common',
    'ui.bootstrap.collapse',
    'app.home',
    'app.info',
    'ui.router',
    'ngResource'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider, $locationProvider ) {
    $urlRouterProvider.otherwise( '/' );

    // HTML5 mode enables to use the SPA without hashbangs (e.g. use app with real urls)
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if ( angular.isDefined( toState.data.pageTitle ) ) {
            $scope.pageTitle = 'Paahine.net - ' + toState.data.pageTitle;
        }
    });
})

;

