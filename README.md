# XFlow JS

[![Build Status](https://travis-ci.org/michiel/xflow-js.svg?branch=master)](https://travis-ci.org/michiel/xflow-js)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/michiel/xflow-js/master/LICENSE)
[![Code Climate](https://img.shields.io/codeclimate/github/kabisaict/flow.svg)](https://lima.codeclimate.com/github/michiel/xflow-js)

## Test

    gulp test
    gulp coverage

## Build

    gulp build

Browser,

    webpack --module-bind "js=babel-loader" lib/xflow-target-browser.js xfb.js

## Documentation

    yuidoc -C -t ~/src/yuidoc-theme-blue lib

## Codegen

    var escodegen = require('escodegen');
    var parse     = require("esprima").parse;
    var fs        = require("fs");

    var src = fs.readFileSync(
      "test.js",
      "utf-8"
    );

    var ast = parse(src);

## TODO

* General

  - Rename state -> scope
  X Fix EventEmitter2 / EventEmitter2.EventEmitter2 reference
  - Fix build copying assets (schema, parser)
  X Add cyclomatic complexity reporter

* Codegen

  - Now only sync, generate async code / Promises
  - Call cross-xflow



