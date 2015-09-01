module.exports = {
    dist: {
        files: [
            {
                src: 'src/html/*.html',
                dest: 'html/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            }
        ]
    }
};