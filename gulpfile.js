const gulp = require('gulp')
const babel = require('gulp-babel')
const runSequence = require('run-sequence')
const clean = require('gulp-clean')
const minify = require('gulp-minify')
const fs = require('fs-extra')
const uploadsRaw = 'app/temp/'
const uploadDir = 'app/uploads/'
const concat = require('gulp-concat')

gulp.task('clean:app', function () {
  return gulp.src('app/*.*', {read: false})
  .pipe(clean())
})

gulp.task('create:folders', function () {
  fs.mkdirs(uploadsRaw)
  fs.mkdirs(uploadDir)
})

gulp.task('main:app', () => {
  return gulp.src('src/app.js')
  .pipe(babel({
    presets: ['es2015-node4']
  }))
  .pipe(gulp.dest('app'))
})

gulp.task('public:js', () => {
  return gulp.src('src/js/*.js')
  .pipe(babel({
    presets: ['es2015-node4']
  }))
  .pipe(minify({
    ext: {
      src: '-debug.js',
      min: '.js'
    },
    compress: true
  }))
  .pipe(gulp.dest('public'))
})

gulp.task('public:css', () => {
  return gulp.src('src/css/*.css')
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('public'))
})
gulp.task('default', () => {
  runSequence(['public:css', 'public:js', 'main:app'])
})

gulp.task('build', () => {
  runSequence(['clean:app', 'create:folders', 'public:css', 'public:js', 'main:app'])
})
