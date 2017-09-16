/*******************************
            Set-up
*******************************/

var gulp = require('gulp-help')(require('gulp'));

// 同步运行任务插件
var runSequence = require('run-sequence');

var buildCSS = require('./tasks/build/css');

var buildImages = require('./tasks/build/images');

var buildJS = require('./tasks/build/javascript');

gulp.task('buildCSS', 'Builds all css from source', buildCSS);

gulp.task('buildImages', 'Compress all pictures from source', buildImages);

gulp.task('buildJS', 'Builds all javascript from source', buildJS);

gulp.task('clean:dist', function() {
    return del.sync('dist');
});

gulp.task('build', ['clean:dist'], callback => {
    runSequence(['buildCSS', 'buildJS'], callback);
})

gulp.task('watch', ['buildCSS'], () => {
	gulp.watch('view/less/**/*.less', ['buildCSS']);
})
