'use strict';

var gulp = require('gulp')
var debug = require('gulp-debug')
var flatten = require('gulp-flatten')
var inject = require('gulp-inject')
var mocha = require('gulp-mocha')
var sourcemaps = require('gulp-sourcemaps')
var tslint = require('gulp-tslint')
var tsc = require('gulp-typescript')
var tsProject = tsc.createProject('tsconfig.json')
var del = require('del')
var Config = require('./gulpfile.config')
var browserSync = require('browser-sync')
var superstatic = require('superstatic')



var config = new Config()


/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts-lint', function () {
    return gulp.src(config.allTypeScript)
               .pipe(tslint())
               .pipe(tslint.report('prose'));
});

/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task('compile-ts', function () {
    var tsResult = gulp.src(config.allTypeScript)
                       .pipe(sourcemaps.init())
                       .pipe(tsc(tsProject));

    tsResult.dts
        .pipe(gulp.dest(config.tsOutputPath));
    return tsResult.js
                   .pipe(sourcemaps.write('.'))
                   .pipe(gulp.dest(config.tsOutputPath));
});


gulp.task('copy-generated', ['compile-ts'], function() {
    return gulp.src(['./generated/**/*.js'])
               .pipe(flatten())
               .pipe(gulp.dest(config.nodeModulesPath));
});


/**
 * Remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task('clean-ts', function (cb) {
  var typeScriptGenFiles = [
                              config.tsOutputPath +'/**/*.js',    // path to all JS files auto gen'd by editor
                              config.tsOutputPath +'/**/*.js.map', // path to all sourcemap files auto gen'd by editor
                              '!' + config.tsOutputPath + '/lib'
                           ];

  // delete the files
  del([config.tsOutputPath, config.nodeModulesPath], cb);
});

gulp.task('watch', function() {
    gulp.watch([config.allTypeScript], ['ts-lint', 'compile-ts']);
});

gulp.task('serve', ['compile-ts', 'watch'], function() {
  process.stdout.write('Starting browserSync and superstatic...\n');
  browserSync({
    port: 3000,
    files: ['index.html', '**/*.js'],
    injectChanges: true,
    logFileChanges: false,
    logLevel: 'silent',
    logPrefix: 'angularin20typescript',
    notify: true,
    reloadDelay: 0,
    server: {
      baseDir: '.',
      middleware: superstatic({ debug: false})
    }
  });
});


gulp.task('test-ts', ['build'], () => {
    var tests = config.nodeModulesPath + 'test-*.js'
    return gulp.src(tests, {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'spec'}));
});

gulp.task('build', ['ts-lint', 'compile-ts', 'copy-generated']);
gulp.task('test', ['test-ts']);
gulp.task('default', ['test']);
