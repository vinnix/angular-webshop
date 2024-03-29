angular.module('Admin', [
    'templates-app',
    'templates-common',
    'Admin.login',
    'Admin.home',
    'Admin.settings',
    'Admin.siteuser',
    'Admin.category',
    'Admin.product',
    'ui.router',
    'ngResource',
    'ngCacheBuster',
    'ui.bootstrap.alert',
    'ui.bootstrap.modal',
    'ui.bootstrap.collapse'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider, $locationProvider, httpRequestInterceptorCacheBusterProvider ) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*rest.*/],true);
})

.controller('AppCtrl', function AppCtrl($scope, $rootScope, $state, $resource, Session, Auth) {

    var get_session = function() {
        Session.get().$promise.then(function(x) {
            if (x && x.username && x.roles) {
                $scope.username = x.username;
                $scope.pages = [
                    {
                        'orderer':'1',
                        'link':'home',
                        'title':'Home',
                        'awesome':'home'
                    },
                    {
                        'orderer':'2',
                        'link':'settings',
                        'title':'Settings',
                        'awesome':'wrench'
                    }
                ];

                x.roles.forEach( function(role) {
                    if (role == 'admin') {
                        $scope.pages.push({
                            'orderer':'3',
                            'link':'siteuser',
                            'title':'Siteuser',
                            'awesome':'user'
                        });
                        $scope.pages.push({
                            'orderer':'4',
                            'link':'category',
                            'title':'Categories',
                            'awesome':'tags'
                        });
                        $scope.pages.push({
                            'orderer':'5',
                            'link':'product',
                            'title':'Products',
                            'awesome':'suitcase'
                        });
                    }
                });
            } else {
                $rootScope.$emit('logout', 1);
                console.log("Error logging in");
            }
        }, function(error) {
            $rootScope.$emit('logout', 1);
            console.log("Session timed out");
        });
    };

    var logout = function() {
        console.log("Logged out");
        Session.remove();
        $scope.pages = null;
        delete $scope.username;
        Auth.disable();
        clearInterval(session_timeout);
        clearTimeout(auto_logout);
        $state.transitionTo('login');
    };

    $scope.logout = function() {
        logout();
    };

    var auto_logout;
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        // Whenever state is changed, we reset auto logout and set it again
        clearTimeout(auto_logout);
        auto_logout = setTimeout(function(){ logout(); }, 900000);
        if (angular.isDefined(toState.data.pageTitle)) {
            $scope.pageTitle = 'Admin - ' + toState.data.pageTitle;
        }
    });

    $rootScope.$on('login', function() {
        get_session();
    });

    $rootScope.$on('logout', function() {
        logout();
    });

    get_session();
    var session_timeout = setInterval(function(){ get_session(); }, 60000);

})

.factory('Auth', function() {
    var service = {};
    var _status = false;

    service.status = function() {
        return _status;
    };
    service.enable = function() {
        _status = true;
    };
    service.disable = function() {
        _status = false;
    };
    return service;
})

.factory('Session', ['$resource', function($resource) {
    return $resource('/rest/session', null, {
        'get': { method: 'GET' }
    });
}])

.factory('Role', ['$resource', function($resource) {
    return $resource('/rest/role', null, {
        'get': { method: 'GET' }
    });
}])

.factory('Siteuser', ['$resource', function($resource) {
    return $resource('/rest/siteuser/:id', {
        id: '@id'
    }, {
        'get': { method: 'GET' },
        'post': { method: 'POST' },
        'update': { method: 'PUT' },
        'delete': { method: 'DELETE' }
    });
}])

.factory('SiteuserCheckUsername', ['$resource', function($resource) {
    return $resource('/rest/siteuser/:id/check/username/:username', {
        id: '@id',
        username: '@username'
    }, {
        'get': { method: 'GET' }
    });
}])

.factory('SiteuserCheckEmail', ['$resource', function($resource) {
    return $resource('/rest/siteuser/:id/check/email/:email', {
        id: '@id',
        email: '@email'
    }, {
        'get': { method: 'GET' }
    });
}])

.factory('Setting', ['$resource', function($resource) {
    return $resource('/rest/setting', null, {
        'get': { method: 'GET' },
        'update': { method: 'PUT' }
    });
}])

.factory('removeobject', function() {
    return function(data,id) {
        var whatIndex = null;
        angular.forEach(data, function(cb, index) {
            if (cb.id === id) {
                whatIndex = index;
            }
        });
        data.splice(whatIndex, 1);
        return data;
    };
})

.factory('Category', ['$resource', function($resource) {
    return $resource('/rest/category/:id', {
        id:'@id'
    });
}])

.factory('CategoryPosition', ['$resource', function($resource) {
    return $resource('/rest/category/:id/position/:position', {
        id:'@id',
        position:'@position'
    });
}])

.factory('Product', ['$resource', function($resource) {
    return $resource('/rest/product/:id', {
        id:'@id'
    });
}])

.factory('ProductImages', ['$resource', function($resource) {
    return $resource('/rest/product/:product/images/:image', {
        product:'@product',
        image:'@image'
    });
}])

.factory('ProductCategories', ['$resource', function($resource) {
    return $resource('/rest/product/:product/categories/:category', {
        product:'@product',
        category:'@category'
    });
}])

.factory('Image', ['$resource', function($resource) {
    return $resource('/rest/image/:id', {
        id:'@id'
    });
}])

;

