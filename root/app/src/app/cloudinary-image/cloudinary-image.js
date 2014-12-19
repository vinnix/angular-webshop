angular.module( 'cloudinary-image', [
])

.directive('cloudinaryImage', function() {
    return {
        restrict: 'E',
        template: '<img ng-if="image" ng-src="{{ image }}">',
        scope: {
            'data': '='
        },
        controller: function( $scope, $attrs, $element, $window ) {
            var default_width = 480,
                default_height = 640;
            var fetchimage = function(data) {
                if (data.cloud_name && data.public_id) {
                    var ratio = $window.devicePixelRatio ? $window.devicePixelRatio : 1,
                        format = $attrs.circle ? "png" : "jpg",
                        cloudname = data.cloud_name,
                        public_id = data.public_id,
                        width,
                        height;

                    if ($attrs.size === 'auto') {
                        // Uncomment this to get debug data
                        //console.log($element.width(), $element.height(), $element.parent().width(), $element.parent().height());
                        width = $element.parent()[0].offsetWidth ? Math.round($element.parent()[0].offsetWidth) : 0;
                        height = $element.parent()[0].offsetHeight ? Math.round($element.parent()[0].offsetHeight) : 0;
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
                        } else {
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
                    } else {
                        image_url = image_url + 
                            'w_' + width + ',h_' + height +
                            ',c_fill';
                    }
                    image_url = image_url + '/' + public_id + "." + format;
                    $scope.image = image_url;
                } else {
                    $scope.image = "/assets/placeholder.png";
                }
            };

            $scope.$watch('data', function(newvalue, oldvalue) {
                if (newvalue && newvalue.public_id && newvalue.cloud_name) {
                    fetchimage(newvalue);
                }
            });
        }
    };
})

;