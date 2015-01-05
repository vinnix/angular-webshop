angular.module( 'inline-svg', [
])

.directive('inlineSvg', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        scope: {
            src: '@'
        },
        link: function(scope, element, attrs) {
            var getSvg = function(src) {
                //console.log(src);
                $.get(src, function(svgDocument) {
                    $element = $(svgDocument)
                        .find('svg')
                        .appendTo(element);
                });
            };

            scope.$watch('src', function(newvalue, oldvalue) {
                if (newvalue && oldvalue) {
                    $timeout(function() {
                        getSvg(newvalue);
                    });
                }
            });
        }
    };
}])

;