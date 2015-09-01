module.exports = {
    scripts: {
        files: ['src/js/*.js'],
        tasks: ['jshint:dev', 'default']
    },
    html: {
        files: ['src/html/*.html'],
        tasks: ['htmllint:dev', 'default']
    },
    sass: {
        files: ['src/sass/*.scss'],
        tasks: ['sass:dist', 'cssmin:dist']
    },
};