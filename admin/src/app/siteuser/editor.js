angular.module( 'Admin.siteuser.editor', [
    'checklist-model'
])

.controller('SiteuserEditorCtrl', function ($scope, $rootScope, $modalInstance, siteuser, Siteuser, SiteuserCheckUsername, SiteuserCheckEmail, Role) {
    $scope.canSubmit = false;
    var originalSiteuser;
    if (siteuser) {
        Siteuser.get({
            id: siteuser.id
        }).$promise.then(function(success) {
            $scope.siteuser = success;
            originalSiteuser = angular.copy($scope.siteuser);
            $scope.canSubmit = true;
        });
    } else {
        $scope.siteuser = {};
        $scope.siteuser.id = 0;
        $scope.siteuser.email = "";
        $scope.siteuser.username = "";
        $scope.siteuser.roles = [];
        originalSiteuser = angular.copy($scope.siteuser);
    }

    Role.get().$promise.then(function(success) {
        $scope.roles = success.roles;
    });

    var checkIfCanSubmit = function() {
        $scope.anythingChanged = true;
        $scope.canSubmit = false;
        if (!$scope.invalidUsername && !$scope.invalidEmail && !$scope.invalidPassword) {
            $scope.canSubmit = true;
        }
    };

    $scope.validateUsername = function(username) {
        if (username && (username !== originalSiteuser.username || $scope.invalidUsername)) {
            $scope.usernameChanged = true;
            if (username.length >= 4 && username.length <= 50) {
                $scope.invalidUsername = undefined;
                SiteuserCheckUsername.get({
                    siteuser: $scope.siteuser.id,
                    username: username
                }).$promise.then(function(success) {
                    $scope.invalidUsername = success.exists;
                    checkIfCanSubmit();
                });
            } else {
                $scope.invalidUsername = true;
            }
        }
    };

    $scope.validateEmail = function(email) {
        if (email && (email !== originalSiteuser.email || $scope.invalidEmail)) {
            $scope.emailChanged = true;
            if (email.length >= 6 && email.length <= 50) {
                $scope.invalidEmail = undefined;
                SiteuserCheckEmail.get({
                    siteuser: $scope.siteuser.id,
                    email: encodeURIComponent(email)
                }).$promise.then(function(success) {
                    $scope.invalidEmail = success.exists;
                    checkIfCanSubmit();
                });
            } else {
                $scope.invalidEmail = true;
            }
        }
    };

    $scope.validatePasswords = function(password1, password2) {
        if ((password1 && password1.length > 0) || (password2 && password2.length > 0)) {
            $scope.passwordChanged = true;
            if (password1 && password1.length >= 6 && password1.length <= 255 && password2 && password2.length >= 6 && password2.length <= 255 && password1 === password2) {
                $scope.invalidPassword = false;
            } else {
                $scope.invalidPassword = true;
            }
            checkIfCanSubmit();
        }
    };

    $scope.save = function () {
        $modalInstance.close($scope.siteuser);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
})

.directive('validEn', function() {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if(!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function(val) {
                var clean = val.replace( /[^a-z0-9]+/g, '');
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function(event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
})

;