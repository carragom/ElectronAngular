

'use strict';

var childProcess = require('child_process');
var electron = require('electron-prebuilt');
var gulp = require('gulp');
var jetpack = require('fs-jetpack');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var os = require('os');
var release_windows = require('./windows.build');
var ts = require('gulp-typescript');


var projectDir = jetpack;
var srcDir = projectDir.cwd('./app');
var buildDir = projectDir.cwd('./build');
var distDir = projectDir.cwd('./dist');
var tsProject = ts.createProject('tsconfig.json');

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('clean', function () {
    return Promise.all([
        buildDir.dirAsync('.', { empty: true }),
        distDir.dirAsync('.', { empty: true })
    ]);
});

gulp.task('copy', ['clean'], function () {
    return Promise.all([
        projectDir.copyAsync('app', buildDir.path(), {
            overwrite: true,
            matching: [
                '*.html',
                '*.css',
            ]
        }),
        projectDir.copyAsync('app', distDir.path(), {
            overwrite: true,
            matching: [
                './node_modules/**/*',
                '*.html',
                'main.js',
                'package.json',
                '!index.html',
            ]
        })
    ]);
});


gulp.task('transpile', ['copy'], function () {
    return gulp.src([
        'typings/tsd.d.ts',
        'app/**/*.ts'
    ], { base: 'app' })
        .pipe(ts(tsProject))
        .pipe(gulp.dest(buildDir.cwd()));
});

gulp.task('build', ['transpile'], function () {
    return gulp.src(buildDir.cwd('./index.html').cwd())
        .pipe(usemin({
            js: [uglify()]
        }))
        .pipe(gulp.dest(distDir.cwd()));
});


gulp.task('run', function () {
    childProcess.spawn(electron, ['./app'], { stdio: 'inherit' });
});

gulp.task('build-electron', function () {
    switch (os.platform()) {
        case 'darwin':
            // execute build.osx.js 
            break;
        case 'linux':
            //execute build.linux.js
            break;
        case 'win32':
            console.log('sdf')
            return release_windows.build();
    }
});
