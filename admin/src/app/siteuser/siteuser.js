angular.module( 'Admin.siteuser', [
    'Admin.siteuser.editor',
    'Admin.siteuser.removal',
    'ui.router'
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

.controller('SiteuserCtrl', function SiteuserCtrl($scope, $modal, $rootScope, Siteuser) {
    var siteuserList = function() {
        $scope.siteusers = [];
        $scope.siteuser = null;
        Siteuser.get().$promise.then(function(success) {
            $scope.siteusers = success.siteusers;
        }, function(error) {
            console.log(error.status);
            if (error.status === 403) {
               $rootScope.$emit('logout', 1);
            }
        });
    };

    var openUserEditor = function(siteuser) {
        var modalInstance = $modal.open({
            templateUrl: 'siteuser/editor.tpl.html',
            controller: 'SiteuserEditorCtrl',
            resolve: {
                siteuser: function () {
                    return siteuser;
                }
            }
        });
        modalInstance.result.then(function(siteuser) {
            if (siteuser.id && siteuser.id > 0) {
                Siteuser.update({
                    "id": siteuser.id,
                    "username": siteuser.username,
                    "password1": siteuser.password1,
                    "password2": siteuser.password2,
                    "first_name": siteuser.first_name,
                    "last_name": siteuser.last_name,
                    "email": siteuser.email,
                    "roles": siteuser.roles,
                }).$promise.then(function(success) {
                    siteuserList();
                });
            } else {
                Siteuser.save({
                    "username": siteuser.username,
                    "password1": siteuser.password1,
                    "password2": siteuser.password2,
                    "first_name": siteuser.first_name,
                    "last_name": siteuser.last_name,
                    "email": siteuser.email,
                    "roles": siteuser.roles,
                }).$promise.then(function(success) {
                    siteuserList();
                });
            }
        });
    };

    $scope.removeSiteuser = function(siteuser) {
        var modalInstance = $modal.open({
            templateUrl: 'siteuser/removal.tpl.html',
            controller: 'SiteuserRemovalCtrl',
            resolve: {
                siteuser: function () {
                    return siteuser;
                }
            }
        });
        modalInstance.result.then(function(siteuser) {
            Siteuser.remove({
                "id": siteuser.id
            }).$promise.then(function(success) {
                siteuserList();
            });
        });
    };

    $scope.createSiteuser = function() {
        openUserEditor();
    };

    $scope.editSiteuser = function(siteuser) {
        openUserEditor(siteuser);
    };

    siteuserList();

})

;
