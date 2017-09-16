const
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    less = require('gulp-less'),
    plumber = require('gulp-plumber'),
    config = require('../gulp-config'),
    paths = require('../gulp-paths'),
    sourcemaps = require('gulp-sourcemaps');

module.exports = () =>
    gulp.src(paths.source.less)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write({ includeContent: false }))
    .pipe(autoprefixer(config.settings.prefix))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(paths.output.css));