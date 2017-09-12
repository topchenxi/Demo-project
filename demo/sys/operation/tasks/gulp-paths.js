/*******************************
             sourcePath
*******************************/
const sourcePath = {
    base: '',
    // clean: '../dist/',
    source: {
        less: 'view/less/oms-style.less',
        images: 'view/images/**/*.+(png|jpg|gif|svg)',
        js: 'controller/**/*.js'
    },
    output: {
        css: 'view/css',
        cssName: 'view/css/oms-style.css',
        minRename: 'oms-style.min.css',
        images: 'dist/images',
        js: 'dist/js'
    }

};

module.exports = sourcePath;