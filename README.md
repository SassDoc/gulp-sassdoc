# gulp-sassdoc [![npm version](http://img.shields.io/npm/v/gulp-sassdoc.svg?style=flat)](https://www.npmjs.org/package/gulp-sassdoc) [![Build Status: Linux](http://img.shields.io/travis/SassDoc/gulp-sassdoc.svg?style=flat)](https://travis-ci.org/SassDoc/gulp-sassdoc?branch=master)

> [SassDoc](https://github.com/SassDoc/sassdoc) Gulp task.

This is a [Gulp friendly](https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/README.md#about-streams) plugin, not using streams.  
Its goal is to make SassDoc integration in your Gulp workflow easier.

## Getting Started

If you haven't used [gulp] before, be sure to check out the [Getting Started] guide, as it explains how to create a [Gulpfile][Getting Started] as well as install and use Gulp plugins. Once you're familiar with that process, install this plugin with this command:

```sh
npm install --save-dev gulp-sassdoc
```

[gulp]: http://gulpjs.com
[Getting Started]: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#getting-started



## Documentation

See the [Gulpfile](Gulpfile.js) in this repo for a full example.


## SassDoc task
_Run this task with the `gulp sassdoc` command._


## Options

Any specified option will be passed through directly to SassDoc, thus you can specify any option that SassDoc supports.
See the [SassDoc documentation](https://github.com/SassDoc/sassdoc/wiki/Customising-the-View) for a list of supported options.


#### verbose

Type: `Boolean`  
Default: `false`

Whether to enable SassDoc own logger or not.


#### config

Type: `String`  
Default: `null`

Path to a view configuration file.


#### display.access

Type: `Array`  
Default: `['public', 'private']`

Access levels that should be displayed.


#### display.alias

Type: `Boolean`  
Default: `false`

Enable/disable display of alias items.


#### display.watermark

Type: `Boolean`  
Default: `true`

Enable/disable display of SassDoc watermark in footer.


#### package

Type: `String | Object`  
Default: `null`

Pass your project informations to the generated view.
Either a path to your `package.json` or an object.

Following keys will be looked for:
`title`
`name`
`version`
`license`
`homepage`
`description`


#### theme


Type: `String`  
Default: `'default'`  
Since: `sassdoc@1.2.0`

Name of a custom theme, either a published package or a local one.
Check the [doc](https://github.com/SassDoc/sassdoc/wiki/Using-Your-Own-Theme) for more infos.


#### groups

Type: `Object`  
Default: `{ 'undefined': 'Ungrouped' }`  
Since: `sassdoc@1.2.0`

Give friendly names to your groups, if any.
Check the [doc](https://github.com/SassDoc/sassdoc-filter#group-name) for more infos.


#### basePath

Type: `String`  
Default: `null`  
Since: `sassdoc@1.2.0`

An URL or a path which will be transformed in a link to the source file.
Check the [doc](https://github.com/SassDoc/sassdoc/wiki/Customising-the-View) for more infos.



_**Heads up**: If a config file is passed and found, its options will prevail over defaults.
Additional options passed to the Gulp task, will complement it but not override it.
You should really manage your options in one place._



### Config examples

```js
var gulp = require('gulp');
var sassdoc = require('gulp-sassdoc');


// Bare minimum example, using defaults.
gulp.task('sassdoc', function () {
  return gulp
    .src('path/to/sass')
    .pipe(sassdoc({
      dest: 'path/to/docs'
    }));
});


// Example with external view configuration file.
gulp.task('sassdoc', function () {
  return gulp
    .src('path/to/sass')
    .pipe(sassdoc({
      dest: 'path/to/docs',
      config: 'path/to/view.json'
    }));
});


// Example with passed in options.
// Tip: you don't need to pass every options,
// just override the one you need.
gulp.task('sassdoc', function () {
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
      basePath: 'https://github.com/SassDoc/sassdoc'
    };

    return gulp
      .src('test/fixture')
      .pipe(sassdoc(options));
});
```

## Authors

[Pascal Duez](http://pascalduez.me)


## Licence

gulp-sassdoc is [unlicensed](http://unlicense.org/).
