/// <binding BeforeBuild='default1' />
var gulp = require('gulp');

var ts = require('gulp-typescript');
var gutil = require('gulp-util');
var through = require('through2');
var assign = require('object-assign');

gulp.task('ts', function () {
    return gulp.src('*.ts')
        .pipe(ts({
            noImplicitAny: true,
            outFile: 'jApps.js'
        }))
        .pipe(gulp.dest('built/local'));
});

gulp.task('build', ['ts']);