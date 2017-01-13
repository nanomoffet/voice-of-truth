var gulp = require('gulp');
var ts = require('gulp-typescript');
var watch = require('gulp-watch');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var tsProject = ts.createProject('./src/tsconfig.json');
var connect = require('gulp-connect');
var deploy = require('gulp-gh-pages');
var merge = require('merge-stream');
/*
 compile typescript
 use ES5 and commonJS module
 */
gulp.task('typescript', function() {
    var tsResult = tsProject.src().pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('dist/js'));
});
/*
 Web server to test app
 */
gulp.task('webserver', function() {
    connect.server({
        livereload: true,
        root: ['.', 'dist']
});
});
/*
 Automatic Live Reload
 */
gulp.task('livereload', function() {
    gulp.src(['dist/styles/*.css', 'dist/js/*.js'])
     .pipe(watch(['dist/styles/*.css', 'dist/js/*.js']))
     .pipe(connect.reload());
     });
     /*
     copy all html files and assets
     */
    gulp.task('copy', function() {
        gulp.src('src/**/*.html').pipe(gulp.dest('dist'));
        gulp.src('src/assets/**/*.*').pipe(gulp.dest('dist/assets'));
    });
    /*
     compile sass files
     */
    gulp.task('sass', function() {
        gulp.src('src/styles/main.scss')
    .pipe(sass())
            .pipe(gulp.dest('dist/styles'));
    });
    /*
     browserify
     now is only for Javascript files
     */
    gulp.task('browserify', function() {
        browserify('./dist/js/main.js').bundle().pipe(source('main.js')).pipe(gulp.dest('dist/js'));
    });
    /*
     Watch typescript and sass
     */
    gulp.task('watch', function() {
        gulp.watch('src/styles/**/*.scss', ['sass']);
         gulp.watch('src/**/*.ts', ['typescript','browserify']);
        gulp.watch('src/**/*.html', ['copy']);
    });

    gulp.task('deploy', function () {
         var source = gulp.src("./dist/**/*");
         var cname = gulp.src("./CNAME");
             return merge(source, cname)
            .pipe(deploy())
    });
    /*
     default task
     */
    gulp.task('default',['sass', 'typescript', 'browserify', 'copy', 'webserver', 'livereload', 'watch']);

    /*Run everything except watch*/
    gulp.task('compile',['sass', 'typescript', 'browserify', 'copy']);