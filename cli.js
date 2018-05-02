#!/usr/bin/env node
'use strict';

var	config, routes, path

var fs         = require('fs-extra'),
	yaml       = require('js-yaml'),
	color      = require('chalk'),
	program    = require('commander'),
	inquirer   = require('inquirer'),
	liveServer = require('live-server');

isGitowl()

program.version('0.1.0', '-v, --version').description('This cli helps you to manager GitOwl.')

var helps = {
	install(){
		console.log('\n  Examples:\n')
		console.log('    $ gitowl install\n')
	},
	routes(){
		console.log('\n  Examples:\n')
		console.log('    $ gitowl routes')
		console.log('    $ gitowl routes list')
		console.log('    $ gitowl routes scan')
		console.log('    $ gitowl routes add')
		console.log('    $ gitowl routes remove')
		console.log('    $ gitowl routes fix\n')
	},
	sitemap(){
		console.log('\n  Examples:\n')
		console.log('    $ gitowl sitemap')
	},
	config(){
		console.log('\n  Examples:\n')
		console.log('    $ gitowl config')
		console.log('    $ gitowl config edit')
		console.log('    $ gitowl config show\n')
	},
	serve(){
		console.log('\n  Examples:\n')
		console.log('    $ gitowl')
		console.log('    $ gitowl serve\n')
	},
	view(){
		console.log('\n  Examples:\n')
		console.log('    $ gitowl view')
	}

}

var run = {
	install(cmd){
		console.log(color.blue.bold('\n Install:\n'))

		inquirer.prompt([{
			name: 'type',
			type: 'list',
			message: 'With what configuration you want to start?',
			choices: [{name:'Basic', value:'basic'}, 
					  {name:'Versions', value:'versions'}, 
					  {name:'Languages', value:'lang'}, 
					  {name:'Versions + Languages '+color.grey('(recommended)'), value:'advanced'}],
		}]).then((answers) => {

			// 1. Check github gitowl release folder a file like releases.json
			// 2. Get the lastest version or which user selected

			console.log(`\nHi. I like ${answers.type}! 😋\n`);
		});
	},

	routes(cmd){
		
		if(cmd == undefined) cmd = 'list'
		if (!opt.routes[cmd]) {
			console.log(color.yellow("\n ERROR: Undefined command "+cmd)+"\n\n  Check:\n   $ gitowl routes --help\n")	
			process.exit(1)
		}

		load.config()
		load.paths(cmd)
	},

	sitemap(cmd){

		/*console.log('Sitemap: Coming Soon..')
		load.config()
		try{
			load.paths(cmd)
		} catch(e){
			cmd = !cmd ? '' : "'"+cmd+"'"			
			console.log(color.yellow("\n ERROR: Undefined command "+cmd)+"\n\n  Check:\n   $ gitowl routes --help\n")	
		}*/
	},

	config(cmd){
		load.config()
		console.log(config)
		if(cmd){
			console.log(cmd)
		} 
	},

	serve(){
		//console.log("Press 'q' or 'e' to close server")
		//process.exit()

		liveServer.start({
			port: 8181, // Set the server port. Defaults to 8080.
			host: "localhost",	// host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
			root: "./", // Set root directory that's being served. Defaults to cwd.
			open: true, // When false, it won't load your browser by default.
			ignore: 'scss', // comma-separated string for paths to ignore
			file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
			wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
			logLevel: 1, // 0 = errors only, 1 = some, 2 = lots
			middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
		})

	},

	view(){
		var marked = require('marked'),
			TerminalRenderer = require('marked-terminal');

		marked.setOptions({
			renderer: new TerminalRenderer()
		});

		// Show the parsed data
		console.log(marked('# Hello \n This is **markdown** printed in the `terminal`'))
	}
	
}

var opt = {
	routes: {
		list(){
			let broken = 0
			console.log(color.blue.bold('\n Routes:\n'))

			routes.forEach(function(item, key, array) {
				let msj = ''

				if(item.folder){
					try {
						fs.statSync(path+"/pages/"+item.folder)
					} catch(e){
						msj = color.red(' Not found!')
						broken++
					}
					console.log('  - '+item.folder+" "+color.grey(item.title)+msj)
	
					item.items.forEach(function(item, key, array) {
						let tree = (key == array.length-1) ? "    └─ " : "    ├─ "
						console.log(tree+item.file+" "+color.grey(item.title)+msj)

					});

				} else {
					try {
						fs.statSync(path+"/pages/"+item.file)
					} catch(e){
						msj = color.red(' Not found!')
						broken++
					}

					console.log('  - '+item.file+" "+color.grey(item.title)+msj)
				}
				console.log(' ')
			});

			if(broken > 0){
				console.log(" "+color.yellow('There are ')+color.red(broken)+color.yellow(' elements not found!')+"")
				console.log(" "+color.grey('You can use')+color.cyan.italic(' gitowl routes fix ')+color.gray('to repair it')+"\n")
			}


		},
		scan(){
			console.log('Route scan')	
			// Search from folders files not listed	
		},
		fix(){
			console.log('Route fix')
			// Delete or repair not found files
		}
	}
}



var load = {
	config(){
		try {
			config = yaml.safeLoad(fs.readFileSync('./config.yaml', 'utf8'));
		} catch (e) {
			console.log(e);
		}
	},

	route(path){
		try {
			routes = yaml.safeLoad(fs.readFileSync(path+'routes.yaml', 'utf8'));
		} catch (e) {
			console.log(color.yellow("\n ERROR: Something happened with "+path+"routes.yaml\n"))
			console.log(color.red(" "+e.message+"\n"));
		}
	},
	
	paths(cmd){
		if(config.lang.active){
			let lang = []

			config.paths.forEach(function(element, key) {
				lang.push({name:element.title,value:key})
			});

			inquirer.prompt([{ name: 'key', type: 'list', choices: lang,
				message: 'What language do you want?',
			}]).then((answers) => {
				let selected = config.paths[answers.key]

				if(config.version.active){
			 		let vers = []

					selected.versions.forEach(function(element, key) {
						vers.push({name:element.title,value:key})
					});

					inquirer.prompt([{ name: 'key',	type: 'list', choices: vers,
						message: 'What version do you want?',
					}]).then((answers) => {
						path = './'+selected.path+'/'+selected.versions[answers.key].path+'/'
						load.route(path)
						opt.routes[cmd]()
					});
				} else {
					path = './'+selected.path+'/'
					load.route(path)
					opt.routes[cmd]()
				}
			});
		} else {
			if(config.version.active){
		 		let vers = []

				config.paths.forEach(function(element, key) {
					vers.push({name:element.title,value:key})
				});

				inquirer.prompt([{ name: 'key',	type: 'list', choices: vers,
					message: 'What version do you want?',
				}]).then((answers) => {
					path = './'+config.paths[answers.key].path+'/'
					load.route(path)
					opt.routes[cmd]()
				});

			} else {
				path = './'
				load.route(path)
				opt.routes[cmd]()
			}
		}
	}
	
}

function isGitowl(){
	try {
		fs.statSync('./gitowl.js')
	} catch(e){
		console.log(color.yellow('No documentation was found'))
		process.exit(1)
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