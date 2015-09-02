(function () {
    'use strict';

    module.exports = function (grunt) {
        grunt.registerTask('build', [
            'clean:dist', 'html2js:webshop', 'concat:dist', 'jshint:dist',
            'copy:dist', 'uglify:dist', 'sass:build', 'cssmin:dist'
        ]);
    };

})();