var fs         = require('fs-extra'),
	color      = require('chalk'),
	inquirer   = require('inquirer');


module.exports = function(){

		let marked = require('marked'),
			TerminalRenderer = require('marked-terminal');

		marked.setOptions({
			renderer: new TerminalRenderer()
		});

		// console.log(marked('# Hello \n This is **markdown** printed in the `terminal`'))



		let files = []
		
		routes.forEach(function(item, key, array) {
			if(item.folder){
				try {
					fs.statSync(path+"pages/"+item.folder)

					item.items.forEach(function(item2, key, array) {
						files.push(path+"pages/"+item.folder+'/'+item2.file)
					});
				} catch(e){
					// console.log(e)
				}

			} else {
				try {
					fs.statSync(path+"pages/"+item.file)
					files.push(path+"pages/"+item.file)

				} catch(e){
					// console.log(e)
				}

			}
		});
	
		//console.log(files[0])

		inquirer.prompt([{ name: 'type', type: 'list', message: 'File:', choices: files }])
				.then((answers) => {
					fs.readFile(answers.type, "utf8", function read(err, data) {
						if (err) {
							// console.log(color.red('File not found!'))
							console.log(err)
						} else {
							console.log(marked(data))
						}
					}
				);
		});


}
