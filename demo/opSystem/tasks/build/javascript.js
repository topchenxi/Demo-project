var gulp = require('gulp');
// 压缩js插件
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var paths = require('../gulp-paths');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');

module.exports = () => {
    gulp.src('controller/buyer/*.js')
        .pipe(plumber())
        .pipe(uglify())
        // .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/js/buyer'));
}