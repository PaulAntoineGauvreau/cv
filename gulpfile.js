const gulp = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

gulp.task('compileSCSS', function() {
  return gulp.src('./src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('minifyCSS', function() {
  return gulp.src('./dist/css/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/css/min'))
});

gulp.task('compileJS', function() {
  return gulp.src('./src/js/*.js')
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(concat('script.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('minifyJS', function() {
  return gulp.src('./src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/min'))
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });

  gulp.watch('./src/scss/*.scss', gulp.series('compileSCSS'));
  gulp.watch('./src/scss/*.scss', gulp.series('minifyCSS'));
  gulp.watch('./src/js/*.js', gulp.series('compileJS'));
  gulp.watch('./src/js/*.js', gulp.series('minifyJS'));
  gulp.watch('./*.html').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('compileSCSS', 'minifyCSS', 'compileJS', 'minifyJS', 'serve'));
