module.exports = {
    dist: {
        files: [
            {
                src: 'src/html/*.html',
                dest: 'html/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            },
            {
                src: 'vendor/angular/angular.min.js',
                dest: 'js/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            },
            {
                src: 'vendor/angular-resource/angular-resource.min.js',
                dest: 'js/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            },
            {
                src: 'vendor/angular-sanitize/angular-sanitize.min.js',
                dest: 'js/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            },
            {
                src: 'vendor/angular-local-storage/dist/angular-local-storage.min.js',
                dest: 'js/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            }
        ]
    }
};