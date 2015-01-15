/**
 * gulp-sassdoc
 *
 * unlicenced
 * https://github.com/SassDoc/gulp-sassdoc/blob/master/UNLICENCE
 */

'use strict';

var fs = require('fs');
var path = require('path');
var sassdoc = require('sassdoc');
var through = require('through2');
var gutil = require('gulp-util');
var _ = require('lodash');

var PluginError = gutil.PluginError;
var color = gutil.colors;

var PLUGIN_NAME = 'gulp-sassdoc';

function fileExists() {
  var filePath = path.join.apply(path, arguments);
  return fs.existsSync(filePath);
}

function loadJSON(filePath) {
  if (!fileExists(filePath)) {
    throw new PluginError(PLUGIN_NAME, 'Source file "' + color.cyan(filePath) + '" not found.');
  }
  else {
    return require(path.join(process.cwd(), filePath));
  }
}

function handleOptions(options) {
  // Defaults.
  options = _.assign({
    verbose: false,
    config: null,
    display: {
      access: ['public', 'private'],
      alias: false,
      watermark: true
    },
    groups: {
      'undefined': 'Ungrouped'
    },
    package: null,
    theme: 'default',
    basePath: null,
    force: true,
    interactive: false
  }, options);

  // If a config file is passed and found,
  // its options will prevail over defauts.
  if (options.config) {
    var config = loadJSON(options.config);

    if (config) {
      options = _.assign(options, config);
    }
  }

  // If a package path is passed try to load the file.
  if (_.isString(options.package)) {
    options.package = loadJSON(options.package);
  }
  // If options.package is not usable, delete it.
  if (!_.isPlainObject(options.package) || _.isEmpty(options.package)) {
    options = _.omit(options, 'package');
  }

  // Enable SassDoc logger.
  if (options.verbose) {
    sassdoc.logger.enabled = true;
  }

  // Clean options not expected by SassDoc.
  options = _.omit(options, ['verbose', 'config']);

  return options;
}

function gulpSassDoc(options) {
  options = handleOptions(options || {});

  if (!options.dest) {
    throw new PluginError(PLUGIN_NAME, '`dest` is required!');
  }

  var src;

  var transform = function (file, enc, cb) {
    if (!src) {
      src = file.isDirectory() ? file.path : file.base;
    }

    cb(null, file);
  };

  var flush = function (cb) {
    sassdoc.documentize(src, options.dest, options)
      .then(function () {
        gutil.log('SassDoc documentation successfully generated.');
        cb();
      })
      .catch(function (err) {
        this.emit('error', new PluginError(PLUGIN_NAME, err));
        cb(err);
      });
  };

  return through.obj(transform, flush);
}

module.exports = gulpSassDoc;
