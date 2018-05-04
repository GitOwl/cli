var fs         = require('fs-extra'),
	yaml       = require('js-yaml'),
	color      = require('chalk'),
	program    = require('commander'),
	inquirer   = require('inquirer');

var load = require('./load.js');

module.exports = {
	install(cmd){
		console.log('Install: Coming Soon..')

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
		let opt = require('./opt.js')

		if(cmd == undefined) cmd = 'list'
		if (!opt.routes[cmd]) {
			console.log(color.yellow("\n ERROR: Undefined command "+cmd)+"\n\n  Check:\n   $ gitowl routes --help\n")	
			process.exit(1)
		}

		load.config()
		load.paths(cmd)
	},

	sitemap(cmd){
		console.log('Sitemap: Coming Soon..')
		/*
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
		require('./apps/serve.js')()

	},

	view(){
		// require('./apps/view.js')()
		load.config()
		load.paths('view')
	}
	
}