var gulp = require('gulp');
var webpack = require('gulp-webpack');
var closureCompiler = require('google-closure-compiler').gulp();
const eslint = require('gulp-eslint');

gulp.task('lint', () => {
    return gulp.src(['./src/**/*.js','!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('default', ['lint'], function() {
    return gulp.src('./index.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(closureCompiler({
            compilation_level: 'ADVANCED_OPTIMIZATIONS',
            warning_level: 'QUIET',
            language_in: 'ECMASCRIPT6_STRICT',
            language_out: 'ECMASCRIPT3',
            output_wrapper: '(function(){\n%output%\n if("undefined"===typeof define) window.yooj = f()}).call(this)',
            js_output_file: 'yooj.min.js'
        }))
        .pipe(gulp.dest('./dist'));
});