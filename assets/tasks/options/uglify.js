module.exports = {
    dist: {
        options: {
            mangle: true,
            compress: {},
            beautify: true
        },
        files: {
            'js/webshop.min.js': ['js/webshop.js']
        }
    }
};