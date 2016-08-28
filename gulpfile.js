const gulp = require('gulp')
const babel = require('gulp-babel')
const runSequence = require('run-sequence')
const del = require('del')
const clean = require('gulp-clean')

/*  gulp.task('clean', () => {
return del.sync('app/')
})  */
gulp.task('clean', function () {
  return gulp.src('app/*.*', {read: false})
  .pipe(clean())
})
// Create an es6 task
gulp.task('es6', () => {
  return gulp.src('src/app.js')
  .pipe(babel({
    presets: ['es2015-node4']
  }))
  .pipe(gulp.dest('app'))
})

gulp.task('default', () => {
  // gulp.watch('src/app.js', ['es6'])
  runSequence(['clean', 'es6'])
})
