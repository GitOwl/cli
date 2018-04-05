#!/usr/bin/env node
'use strict';

var program = require('commander');

program
  .version('0.1.0')
  .option('-i, --install', 'Install GitOwl')
  .option('-r, --routes', 'Make routes')
  .option('-s, --sitemap', 'Make sitemap')
  .option('-c, -- [type]', 'Configuration [marble]', 'marble')
  .parse(process.argv);

console.log('Selected:');
if (program.install) console.log('  - install');
if (program.routes) console.log('  - routes');
if (program.sitemap) console.log('  - sitemap');
console.log('  - %s config', program.config);

