var fs         = require('fs-extra'),
	yaml       = require('js-yaml'),
	inquirer   = require('inquirer'),
	color      = require('chalk')

module.exports = {
	config(){
		try {
			config = yaml.safeLoad(fs.readFileSync('./config.yaml', 'utf8'))
		} catch(e) {
			console.log(e)
		}
	},

	route(path){
		try {
			routes = yaml.safeLoad(fs.readFileSync(path+'routes.yaml', 'utf8'))
		} catch(e) {
			console.log(color.yellow("\n ERROR: Something happened with "+path+"routes.yaml\n"))
			console.log(color.red(" "+e.message+"\n"))
		}
	},
	
	paths(cmd){
		let opt = require('./opt.js');

		if(config.lang.active){
			let lang = []

			config.paths.forEach(function(element, key) {
				lang.push({name:element.title,value:key})
			});

			inquirer.prompt([{ name: 'key', type: 'list', choices: lang, message: 'Language:' }])
					.then((answers) => {
						let selected = config.paths[answers.key]

						if(config.version.active){
					 		let vers = []

							selected.versions.forEach(function(element, key) {
								vers.push({name:element.title,value:key})
							});

							inquirer.prompt([{ name: 'key',	type: 'list', choices: vers, message: 'Version:' }])
									.then((answers) => {
										path = './'+selected.path+'/'+selected.versions[answers.key].path+'/'
										this.route(path)
										opt.routes[cmd]()
									});
						} else {
							path = './'+selected.path+'/'
							this.route(path)
							opt.routes[cmd]()
						}
					});
		} else {
			if(config.version.active){
		 		let vers = []

				config.paths.forEach(function(element, key) {
					vers.push({name:element.title,value:key})
				});

				inquirer.prompt([{ name: 'key',	type: 'list', choices: vers, message: 'Version:' }])
						.then((answers) => {
							path = './'+config.paths[answers.key].path+'/'
							this.route(path)
							opt.routes[cmd]()
						});

			} else {
				path = './'
				this.route(path)
				opt.routes[cmd]()
			}
		}
	}

}