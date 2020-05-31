#!/usr/bin/env node
'use strict';

var	config, routes, path

var fs       = require('fs-extra'),
	color      = require('chalk'),
	program    = require('commander');

isGitowl()

program.version('0.1.0', '-v, --version').description('This cli helps you to manager GitOwl.')

var helps = require('./lib/helps.js'),
    run   = require('./lib/run.js'),
    opt   = require('./lib/opt.js'),
    load  = require('./lib/load.js');

function isGitowl(){
	try {
		fs.statSync('./gitowl.js')
	} catch(e){
		console.log(color.yellow('No documentation was found'))
		process.exit(1)
	}
}


program
  .command('test')
  .alias('t')
  .description('Test GitOwl')
  .action(run.test)
  .on('--help', helps.test);


program
  .command('install [cmd]')
  .alias('i')
  .description('Install GitOwl')
  .action(run.install)
  .on('--help', helps.install);


program
  .command('routes [cmd]')
  .alias('r')
  .description('Automatic configure routes.')
  .action(run.routes)
  .on('--help', helps.routes);


program
  .command('sitemap [cmd]')
  .alias('s')
  .description('Make a sitemap.')
  .action(run.sitemap)
  .on('--help', helps.sitemap);


program
  .command('config [cmd]')
  .alias('c')
  .description('Configuration.')
  .action(run.config)
  .on('--help', helps.config);


program
  .command('serve [cmd]')
  .description('Make a server to show GitOwl.')
  .action(run.serve)
  .on('--help', helps.serve);


program
  .command('view [cmd]')
  .description('Show on console the documentation.')
  .action(run.view)
  .on('--help', helps.view);


// program
//   .command('*', {isDefault: true})
//   .description('Serve GitOwl. Defaul')
//   .action(run.serve)
//   .on('--help', helps.serve);




program.parse(process.argv);


if (process.argv.length == 2) {
  run.serve()
} 
/*
console.log('Selected:');
if (program.install) console.log('  - install');
if (program.routes) console.log('  - routes');
if (program.sitemap) console.log('  - sitemap');
console.log('  - %s config', program.config);
*/