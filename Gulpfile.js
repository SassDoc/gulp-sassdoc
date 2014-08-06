'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var shell = require('gulp-shell')
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var rimraf = require('rimraf');
var sassdoc = require('./');


gulp.task('lint', function () {
  return gulp
    .src(['tasks/*js', 'test/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});


gulp.task('sassdoc_config', function () {
  var options = {
    dest: 'test/docs',
    verbose: true,
    config: 'test/view.json'
  };

  return gulp
    .src('test/fixture')
    .pipe(sassdoc(options));
});


gulp.task('sassdoc_options', function () {
  var options = {
    dest: 'test/docs',
    verbose: true,
    display: {
      access: ['public', 'private'],
      alias: true,
      watermark: true
    },
    groups: {
      'undefined': 'Ungrouped',
      'foo': 'Foo group',
      'bar': 'Bar group'
    },
    package: './package.json',
    theme: 'default',
    basePath: 'https://github.com/SassDoc/gulp-sassdoc/tree/master/test/fixture'
  };

  return gulp
    .src('test/fixture')
    .pipe(sassdoc(options));
});


gulp.task('tape', shell.task([
  'node test/*-test.js | faucet',
]));


gulp.task('clean', function (cb) {
  rimraf('test/docs', cb);
});


gulp.task('test', function () {
  runSequence(
    'lint',
    'sassdoc_config',
    'tape',
    'clean',
    'sassdoc_options',
    'tape',
    'clean'
  );
});
