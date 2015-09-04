(function() {
    'use strict';

    var module = angular.module('webshop-image', [
    ]);

    module.directive('webshopImage', ['Image', function(Image) {
        return {
            restrict: 'E',
            templateUrl: 'webshop-image.tpl.html',
            scope: {
                'imageId': '@id'
            },
            controller: function( $scope, $attrs, $element, $window, Image ) {
                var default_width = 480,
                    default_height = 640;
                var fetchimage = function(id) {
                    Image.get({
                        id: id
                    }).$promise.then(function(success) {
                        if (success.cloudinary && success.cloudinary.cloud_name && success.cloudinary.public_id) {
                            var ratio = $window.devicePixelRatio ? $window.devicePixelRatio : 1,
                                format = $attrs.circle ? "png" : "jpg",
                                cloudname = success.cloudinary.cloud_name,
                                public_id = success.cloudinary.public_id,
                                width,
                                height;

                            if ($attrs.imgClass) {
                                $scope.imgClass = $attrs.imgClass;
                            }

                            if ($attrs.size === 'auto') {
                                width = $element.parent()[0].offsetParent.clientWidth ? Math.round($element.parent()[0].offsetParent.clientWidth) : 0;
                                height = $element.parent()[0].offsetParent.clientHeight ? Math.round($element.parent()[0].offsetParent.clientHeight) : 0;
                                if (width === 0 && height > 0) {
                                    width = height;
                                } else if (height === 0 && width > 0) {
                                    height = width;
                                } else if ($attrs.width > 0) {
                                    width = $attrs.width;
                                    if ($attrs.height > 0) {
                                        height = $attrs.height;
                                    } else {
                                        height = width;
                                    }
                                } else if (width === 0 && height === 0) {
                                    width = default_width;
                                    height = default_height;
                                }
                            } else {
                                width = $attrs.width ? $attrs.width : default_width;
                                height = $attrs.height ? $attrs.height : default_height;
                            }

                            width = width * ratio;
                            height = height * ratio;

                            var image_url = '//res.cloudinary.com/' + cloudname + '/image/upload/';
                            if ($attrs.circle) {
                                image_url = image_url +
                                    'w_' + width + ',h_' + width +
                                    ',c_thumb,r_max';
                            } else if ($attrs.square) {
                                image_url = image_url +
                                    'w_' + width + ',h_' + width +
                                    ',c_thumb';
                            } else {
                                image_url = image_url +
                                    'w_' + width + ',h_' + height +
                                    ',c_fill';
                            }
                            image_url = image_url + '/' + public_id + "." + format;
                            $scope.image = image_url;
                        } else {
                            $scope.image = "/assets/empty.png";
                        }
                    });
                };

                $scope.$watch('imageId', function(newValue, oldValue) {
                    if (newValue) {
                        console.log("Fetching",newValue);
                        fetchimage(newValue);
                    }
                });
            }
        };
    }]);

}());