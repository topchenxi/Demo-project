const
    gulp = require('gulp'),
    config = require('../gulp-config'),
    // 压缩图片插件
    imagemin = require('gulp-imagemin'),
    // 压缩png图片的插件
    pngquant = require('imagemin-pngquant'),
    paths = require('../gulp-paths'),

    imageminGifsicle = require('imagemin-gifsicle');



module.exports = () => {
    // 报错 未完待续
    return;
    gulp.src(paths.source.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [imageminGifsicle()]
        }))
        .pipe(gulp.dest(paths.output.images));
}