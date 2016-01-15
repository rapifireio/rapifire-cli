var gulp = require('gulp');
var prettify = require('gulp-jsbeautifier');

gulp.task('format-js', function() {
  gulp.src(['./rapifire-cli*', './tools.js', './config.js'])
    .pipe(prettify({config: '.jsbeautifyrc', mode: 'VERIFY_AND_WRITE'}))
    .pipe(gulp.dest('./'))
});