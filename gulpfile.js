let gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
let autoprefixer = require('gulp-autoprefixer');
let babel = require('gulp-babel');
let concat = require('gulp-concat');
let del = require('del');
let jshint = require('gulp-jshint');
let uglify = require('gulp-uglify');
let cache = require('gulp-cache');
let cleanCSS = require('gulp-clean-css');
let sass = require('gulp-sass');
let browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "./dist"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  gulp.src('src/images/**/*')
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('styles', function(){
  gulp.src(['src/styles/**/*.+(scss|css)'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(cleanCSS())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('dist/styles/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
  return gulp.src('src/scripts/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(babel())
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('copy', function () {
  gulp.src('src/*.+(html|pdf)')
      .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
  return del.sync('dist');
})

gulp.task('watch', function(){
  gulp.watch("src/styles/**/*.scss", ['styles']);
  gulp.watch("src/scripts/**/*.js", ['scripts']);
  gulp.watch("src/*.html", ['copy','bs-reload']);
});

gulp.task('default', ['clean','styles','images','scripts','copy','watch','browser-sync']);