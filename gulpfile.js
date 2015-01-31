var gulp = require('gulp');
var browserify = require('gulp-browserify');
var stylus = require('gulp-stylus');
var nib = require('nib');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');

gulp.task('compile:scripts', function () {
  gulp.src('src/scripts/main.js')
    .pipe(plumber())
    .pipe(browserify())
    .pipe(rename('grid-of-triangles.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('compile:styles', function () {
  gulp.src('src/styles/main.styl')
    .pipe(plumber())
    .pipe(stylus({
      'use': nib()
    }))
    .pipe(rename('grid-of-triangles.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  gulp.watch('src/scripts/*.js', ['compile:scripts']);
  gulp.watch('src/styles/*.styl', ['compile:styles']);
});

gulp.task('dist', ['compile:styles', 'compile:scripts']);
gulp.task('default', ['dist', 'watch'/*, 'serve'*/]);