#!/usr/bin/env node
/*
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
  Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*jslint sloppy:true node:true */

var fs = require('fs'),
    esprima = require('esprima'),
    fname,
    content,
    options,
    syntax;

if (process.argv.length <= 2) {
    console.log('Usage:');
    console.log('   esparse [options] file.js');
    console.log();
    console.log('Available options:');
    console.log();
    console.log('  --comment      Gather all line and block comments in an array');
    console.log('  --loc          Include line-column location info for each syntax node');
    console.log('  --range        Include index-based range for each syntax node');
    console.log('  --raw          Display the raw value of literals');
    console.log('  --tolerant     Tolerate errors on a best-effort basis (experimental)');
    console.log('  -v, --version  Shows program version');
    console.log();
    process.exit(1);
}

options = {};

process.argv.splice(2).forEach(function (entry) {

    if (entry === '-v' || entry === '--version') {
        console.log('ECMAScript Parser (using Esprima version', esprima.version, ')');
        console.log();
        process.exit(0);
    } else if (entry === '--comment') {
        options.comment = true;
    } else if (entry === '--loc') {
        options.loc = true;
    } else if (entry === '--range') {
        options.range = true;
    } else if (entry === '--raw') {
        options.raw = true;
    } else if (entry === '--tolerant') {
        options.tolerant = true;
    } else if (entry.slice(0, 2) === '--') {
        console.log('Error: unknown option ' + entry + '.');
        process.exit(1);
    } else if (typeof fname === 'string') {
        console.log('Error: more than one input file.');
        process.exit(1);
    } else {
        fname = entry;
    }
});

if (typeof fname !== 'string') {
    console.log('Error: no input file.');
    process.exit(1);
}

try {
    content = fs.readFileSync(fname, 'utf-8');
    syntax = esprima.parse(content, options);
    console.log(JSON.stringify(syntax, null, 4));
} catch (e) {
    console.log('Error: ' + e.message);
    process.exit(1);
}
