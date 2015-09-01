(function () {
"use strict";

    module.exports = function(grunt) {
        // Utility to load the different option files
        // based on their names
        function loadConfig(path) {
            var glob = require('glob');
            var object = {};
            var key;

            glob.sync('*', {cwd: path}).forEach(function(option) {
                key = option.replace(/\.js$/,'');
                object[key] = require(path + option);
            });

            return object;
        }

        // Initial config
        var config = {
            pkg: grunt.file.readJSON('package.json')
        }

        // Load all the tasks options in tasks/options base on the name:
        grunt.util._.extend(config, loadConfig('./options/'));

        grunt.initConfig(config);

        require('load-grunt-tasks')(grunt);

        // Default Task is basically a rebuild
        grunt.registerTask('default', [
            'clean:dist', 'html2js:webshop', 'concat:dist', 'jshint:dist',
            'copy:dist', 'uglify:dist', 'sass:dist', 'cssmin:dist'
        ]);
    };
})();