'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

gulp.task('sass', function () {
    gulp.src('./app/assets/styles/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./app/assets/styles'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./app/assets/styles/*.scss', ['sass']);
});

gulp.task('pre-test', function () {
    return gulp.src(['server/**/*.js'])
        // Covering files
        .pipe(istanbul(
            {
                includeUntested: true
            }
        ))
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
    return gulp.src(['test/specs/**/*.js'])
        .pipe(mocha())
        // Creating the reports after tests ran
        .pipe(istanbul.writeReports(
            {
                dir: './test/coverage',
                reporters: [ 'lcov', 'text-summary' ]
            }
        ));
});