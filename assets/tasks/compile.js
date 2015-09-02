(function () {
    'use strict';

    module.exports = function (grunt) {
        grunt.registerTask('compile', [
            'html2js:webshop', 'concat:dist', 'jshint:dist',
            'copy:dist', 'sass:compile'
        ]);
    };

})();