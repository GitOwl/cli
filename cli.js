#!/usr/bin/env node
'use strict';

var program = require('commander'),
	inquirer = require('inquirer'),
	liveServer = require("live-server");

program.version('0.0.1', '-v, --version').description('This cli helps you to manager GitOwl.')


var helps = {
	install(){
		console.log('\n  Examples:\n')
		console.log('    $ gitowl install')
		console.log('    $ gitowl install advanced\n')
	},
	routes(){
		console.log('\n  Examples:\n')
		console.log('    $ gitowl routes')
		console.log('    $ gitowl routes fix\n')
	},
	sitemap(){
		console.log('\n  Examples:\n')
		console.log('    $ gitowl sitemap')
	},
	config(){
		console.log('\n  Examples:\n')
		console.log('    $ gitowl config')
	},
	serve(){
		console.log('\n  Examples:\n')
		console.log('    $ gitowl')
		console.log('    $ gitowl serve')
	}

}

var run = {
	install(cmd){

		inquirer.prompt([{
			name: 'type',
			type: 'list',
			message: 'With what configuration you want to start?',
			choices: ['Basic', 'Versions', 'Languages', 'Versions + Languages'],
			default: 0,
		}]).then((answers) => {

			console.log(`\nHi. I like ${answers.type}! 😋\n`);
		});
	},

	routes(cmd){
		console.log('Routes: Coming Soon..')
		if(cmd){
			console.log(cmd)
		} 
	},

	sitemap(cmd){
		console.log('Sitemap: Coming Soon..')
		if(cmd){
			console.log(cmd)
		}
	},

	config(cmd){
		console.log('Config: Coming Soon..')
		if(cmd){
			console.log(cmd)
		} 
	},

	serve(){
		//console.log("Press 'q' or 'e' to close server")
		//process.exit()

		liveServer.start({
			port: 8181, // Set the server port. Defaults to 8080.
			host: "localhost",
			// host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
			root: "./", // Set root directory that's being served. Defaults to cwd.
			open: true, // When false, it won't load your browser by default.
			ignore: 'scss', // comma-separated string for paths to ignore
			file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
			wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
			mount: [['/components', './node_modules']], // Mount a directory to a route.
			logLevel: 1, // 0 = errors only, 1 = some, 2 = lots
			middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
		})

	}
	
}

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