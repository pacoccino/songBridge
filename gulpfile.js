'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
    gulp.src('./app/assets/styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./app/assets/styles'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./app/assets/styles/*.scss', ['sass']);
});