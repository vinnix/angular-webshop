angular.module( 'admin', [
    'templates-app',
    'templates-common',
    'admin.home',
    'admin.login',
    'admin.settings',
    'admin.siteuser',
    'admin.category',
    'admin.product',
    'ui.router',
    'ngResource',
    'ngCacheBuster'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider, $locationProvider, httpRequestInterceptorCacheBusterProvider ) {
    $urlRouterProvider.otherwise( '/' );
    $locationProvider.html5Mode(true);

    httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*rest.*/],true);
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl($scope, $rootScope, $state, Session, Auth) {

    var get_session = function() {
        Session.get().$promise.then(function(x) {
            Auth.enable();
            $scope.username = x.username;
            $scope.pages = [
                {
                    'orderer':1,
                    'link':'home',
                    'title':'Home',
                    'awesome':'home'
                },
                {
                    'orderer':2,
                    'link':'settings',
                    'title':'Settings',
                    'awesome':'wrench'
                }
            ];

            x.roles.forEach( function(role) {
                if (role == 'admin') {
                    $scope.pages.push({
                        'orderer':3,
                        'link':'siteuser',
                        'title':'Siteuser',
                        'awesome':'user'
                    });
                    $scope.pages.push({
                        'orderer':4,
                        'link':'category',
                        'title':'Categories',
                        'awesome':'tags'
                    });
                    $scope.pages.push({
                        'orderer':5,
                        'link':'product',
                        'title':'Products',
                        'awesome':'suitcase'
                    });
                }
            });
        }, function(error) {
            $rootScope.$emit('logout', 1);
            console.log("Session timed out");
        });
    };

    var session_timeout;
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
        auto_logout = setTimeout(function(){ logout(); }, (30*60*1000));
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
    session_timeout = setInterval(function(){ get_session(); }, (5*60*1000));
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
    return $resource('/rest/session', {
    }); 
}])

.factory('Siteuser', ['$resource', function($resource) {
    return $resource('/rest/siteuser/:id', {
        id:'@id'
    }); 
}])

.factory('Setting', ['$resource', function($resource) {
    return $resource('/rest/setting', {
    }); 
}])

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

.factory('Image', ['$resource', function($resource) {
    return $resource('/rest/image/:id', {
        id:'@id'
    }); 
}])

.factory('removeobject', function() {
    return function(data, id) {
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

.factory('contains', function() {
    return function(item, array) {
        if (item && array) {
            var i = array.length;
            while (i--) {
                if (array[i] === item) {
                    return true;
                }
            }
        }
        return false;
    };
})

.factory('containsid', function() {
    return function(id, array) {
        if (id && array) {
            var i = array.length;
            while (i--) {
                if (array[i].id === id) {
                    return true;
                }
            }
        }
        return false;
    };
})

;

