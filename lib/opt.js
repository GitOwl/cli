var fs         = require('fs-extra'),
	color      = require('chalk'),
	inquirer   = require('inquirer');


module.exports = {
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
			console.log('Route scan: ')	
			// Search from folders files not listed	
		},
		fix(){
			console.log('Route fix')
			// Delete or repair not found files
		}, 
		view(){
			require('./apps/view.js')()
		}
	}
}
