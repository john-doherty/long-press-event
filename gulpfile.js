'use strict';

var gulp = require('gulp');
var minifyJs = require('gulp-minify');
var del = require('del');
var runSequence = require('run-sequence');
var replace = require('gulp-string-replace');
var pjson = require('./package.json');

gulp.task('clean', function () {
    return del(['dist']);
});

gulp.task('build-js', function () {
    return gulp.src('./src/*.js')
        .pipe(minifyJs({
            noSource: true,
            ext: {
                min: '.min.js'
            },
            preserveComments: 'some',
            exclude: ['tasks']
        }))
        .pipe(replace(new RegExp('@version@', 'g'), pjson.version))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', function (callback) {
    runSequence(
        'clean',
        'build-js',
        callback
    );
});
