'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var clean = require('gulp-clean');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var sassdoc = require('./');


gulp.task('mocha', function () {
  return gulp
    .src('test/*-test.js', { read: false })
    .pipe(mocha({ reporter: 'spec' }))
    .on('error', gutil.log);
});


gulp.task('lint', function () {
  return gulp
    .src(['tasks/*js', 'test/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});


gulp.task('clean', function () {
  return gulp
    .src('test/docs', { read: false })
    .pipe(clean());
});


gulp.task('sassdoc_config', function () {
  return gulp
    .src('test/fixture')
    .pipe(sassdoc({
      dest: 'test/docs',
      verbose: true,
      config: 'test/view.json'
    }));
});


gulp.task('sassdoc_options', function () {
  return gulp
    .src('test/fixture')
    .pipe(sassdoc({
      dest: 'test/docs',
      verbose: true,
      display: {
        access: ['public', 'private'],
        alias: true,
        watermark: true
      },
      package: './package.json'
    }));
});


gulp.task('test', function () {
  runSequence('lint',
    'sassdoc_config', 'mocha', 'clean',
    'sassdoc_options', 'mocha', 'clean'
  );
});
