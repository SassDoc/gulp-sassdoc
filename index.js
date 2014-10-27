/*
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
var chalk = require('chalk');
var _ = require('lodash');

var PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-sassdoc';


function fileExists() {
  var filePath = path.join.apply(path, arguments);
  return fs.existsSync(filePath);
}


function loadJSON(filePath) {
  if (!fileExists(filePath)) {
    throw new PluginError(PLUGIN_NAME, 'Source file "' + chalk.cyan(filePath) + '" not found.');
    return false;
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
    force: false,
    interactive: true
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

  var stream = through.obj(function (file, enc, cb) {
    var self = this;

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    sassdoc.documentize(file.path, options.dest, options)
      .then(function () {
        gutil.log('SassDoc documentation successfully generated.');
        self.push(file);
        cb();
      })
      .catch(function (err) {
        self.emit('error', new PluginError(PLUGIN_NAME, err));
        self.push(file);
        cb(err);
      });

  });

  return stream;
}


module.exports = gulpSassDoc;
