var files = {
    'css/webshop.css': 'src/sass/webshop.scss'
};

module.exports = {
    build: {
        options: {
            style: 'expanded'
        },
        files: files
    },
    compile: {
        options: {
            style: 'expanded',
            quiet: false
        },
        files: files,
    }
};