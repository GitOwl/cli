var fs       = require('fs-extra'),
	color    = require('chalk'),
	inquirer = require('inquirer'),
	blessed  = require('blessed');

var content, files, screen, box, sidebar, active = 0

module.exports = {
	gui(){
		screen = blessed.screen({
		  smartCSR: true,
		  dockBorders: true,
		  title: 'GitOwl'
		});

		// screen.title = 'GitOwl';

		box = blessed.box({
			top: 'center',
			right: 0,
			width: '80%',
			height: '100%',
			padding:  {
				top: 1,
				bottom: 1,
				left: 2,
				right: 0,
			},
			tags: true,
			keys: true,
			mouse: true,
			scrollable: true,
			// border: {
			//   type: 'line'
			// },
			scrollbar: {
				style: {
					bg: '#a4a4a4',
				},
				//track: {					
				//	bg: '#f8f8f8',
				//}
			},

			style: {
				fg: 'white',
				bg: 'none',
				// border: {
				// 	fg: '#f0f0f0'
				// },
				// hover: {
				//   bg: 'green'
				// }
			}
		});

		screen.append(box);

		sidebar = blessed.List({
			bottom: 0,
			left: 0,
			padding: 1,
			width: '20%',
			height: '83%',
			interactive: true,
			// keys: true,  // TO FIX
			mouse: true,   // TO FIX
			scrollable: true,
			tags: true,
			// border: {
				// padding: 0,
				// type: 'line'
			// },
			style: {
				fg: 'white',
				bg: '#3a424d',
				selected:{
					bg: '#454F5C',
					fg: '#f6f6f6'
				}
			},
			border: {
				bg: '#3a424d',
			},
			// hover: {
			//   bg: 'green'
			// }
		});

		screen.append(sidebar);

		let header = blessed.box({
			parent: sidebar,
			top: '0',
			left: '0',
			width: '20%',
			height: '20%',
			content: '{#f0f0f0-fg}{bold}GitOwl{bold}{/#f0f0f0-fg}\n\n{#E1DDC8-fg}Press ESC to quit\nUse ← and → to change pages{/#E1DDC8-fg}',
			align: 'center',
			valign: 'middle',
			tags: true,
			// border: {
			// 	type: 'line'
			// },
			style: {

	    		//bold: true,
				fg: 'white',
				bg: 'blue',
				//bg: '#3a424d',
				border: {
					// fg: '#f0f0f0',
					bg: 'blue',
				},
				// hover: {
				//   bg: 'green'
				// }
			}
		});

		screen.append(header);

		scroll = blessed.box({
			parent: box,
			bottom: 0,
			right: 0,
			width: 50,
			height: 1,
			padding: 0,
			tags: true,
			align: 'right',
			valign: 'bottom',
			// border: {
			//   type: 'line'
			// },

			style: {
				fg: '#f6f6f6',
				// fg: 'white',
				bg: 'none',
				// bg: 'none',
				// bg: '#f0f0f0'
				// border: {
				// 	fg: '#f0f0f0'
				// },
				// hover: {
				//   bg: 'green'
				// }
			}
		});

		screen.append(scroll)
		

		credit = blessed.box({
			bottom: 0,
			left: 0,
			width: '20%',
			height: 1,
			padding: 0,
			tags: true,
			content: 'Power by {#f6f6f6-fg}{bold}GitOwl{/bold}{/#f6f6f6-fg}',
			align: 'center',
			valign: 'bottom',
			// border: {
			//   type: 'line'
			// },

			style: {
				// fg: '#f6f6f6',
				fg: 'white',
				bg: '#353c46',
				// bg: 'none',
				// bg: '#f0f0f0'
				// border: {
				// 	fg: '#f0f0f0'
				// },
				// hover: {
				//   bg: 'green'
				// }
			}
		});

		screen.append(credit)

		var helpModal = blessed.box({
			top: 'center',
			left: 'center',
			width: 40,
			height: 21,			
			padding: {
				top: 0,
				left: 1,
				right: 1,
				bottom: 0,
			},
			hidden: true,
			// draggable: true,
			content: this.content.help(),
			tags: true,
			border: {
				type: 'line'
			},
			style: {
				fg: 'white',
				bg: '#3a424d',
				border: {
					fg: '#737373',
					bg: '#3a424d',
				},
				// hover: {
				// 	bg: 'green'
				// }
			}
		});
		
		screen.append(helpModal)


		box.on('scroll', function(data) {
			let perc = Math.trunc(box.getScrollPerc()), msj = ''
			if(perc == 100) 
				msj = "{grey-fg}Press 't' to go top{/grey-fg}   "
			
			scroll.setContent(msj+perc+'%')
			if(perc == 0) 
				scroll.setContent('')
			
			screen.render()
		});

		credit.on('click', function(data) {
			helpModal.toggle()
			screen.render()
		});

		header.on('click', function(data) {
			helpModal.toggle()
			screen.render()
		});

		box.on('click', function(data) {
			helpModal.hide()
			screen.render()
		});

		var self = this, count = 0 

		sidebar.on('select', function(item) {
			active = sidebar.getItemIndex(item.content)
			self.page()
		});

		screen.key(['right', 'left', 'j', 'k', 'r', 'c', 't', 'h', 'escape', 'q', 'C-c'], function(ch, key) {
			count++ // Fix duplicate keypress
			if(count & 1){ 

				//screen.remove(helpModal)
				if(key.name !== 'h') helpModal.hide()

				switch(key.name) {
					case 'right':
					case 'k':
						active++
						sidebar.down()
						self.page()
						break
					case 'left':
					case 'j':
						active--
						sidebar.up()
						self.page()
						break
					case 'r':
						// box.setContent('{bold}{yellow-fg}Routes:{/yellow-fg}{/bold}\n'+JSON.stringify(routes, null, 3))
						box.setContent(self.content.routes())
						screen.render()
						break
					case 'c':
						box.setContent(self.content.config())
						screen.render()
						break
					case 't':
						box.resetScroll()
						break
					case 'h':
						helpModal.toggle()
						screen.render()
						break
					case 'escape':
					case 'q':
					case 'C-c':
						return process.exit(0)
				} 
			} 

		});


		box.focus();

		screen.render();

	},

	files(){

		files = []
		
		routes.forEach(function(item, key, array) {
			if(item.folder){
				try {
					fs.statSync(path+"pages/"+item.folder)
					files.push(path+"pages/"+item.folder+"/chapter.md")
					sidebar.add(item.title)

					item.items.forEach(function(item2, key, array) {
						files.push(path+"pages/"+item.folder+'/'+item2.file)

						let tree = (key == array.length-1) ? "  └─ " : "  ├─ "
						sidebar.add(tree+item2.title)
					});
				} catch(e){	/*console.log(e)*/ }

			} else {
				try {
					fs.statSync(path+"pages/"+item.file)
					files.push(path+"pages/"+item.file)
					sidebar.add(item.title)
				} catch(e){	/*console.log(e)*/ }

			}
		});

	},

	page(){
		this.check()

		let marked = require('marked'), TerminalRenderer = require('marked-terminal');

		marked.setOptions({
			renderer: new TerminalRenderer()
		});


		fs.readFile(files[active], "utf8", function read(err, data) {
			if (err) {
				content = marked(err)
			} else {
				content = marked(data)
			}

			try{
				scroll.setContent(' ')
				box.setContent(content+' ')
			} catch(e) {
				// console.log(content)
				box.setContent('{red-fg}Error:{/red-fg}\n'+e)
			}
 			screen.render();

		});
	},

	check(){
		if(files == null){
			this.files()
		}

		active = (active < 0) ? 0 : (active > (files.length-1)) ? files.length-1 : active;
	},

	content:{
		help(){
			return 	'{right}{#76859C-fg}{bold}x{/bold}{/#76859C-fg}{/right}\n\n'+
					'{center}{#f6f6f6-fg}{bold}GitOwl Cli{/bold}{/#f6f6f6-fg}{/center}\n'+
					'{center}{#E1DDC8-fg}http://gitowl.github.com{/#E1DDC8-fg}{/center}\n'+
					'{center}{#E1DDC8-fg}Version: 1.0{/#E1DDC8-fg}{/center}\n\n\n'+
					'{center}{#f6f6f6-fg}{bold}Help{/bold}{/#f6f6f6-fg}{/center}\n\n'+
					'{center}{#E1DDC8-fg}ESC or q: Quit       \n'+
					'→ or k: Next page    \n'+
					'← or j: Previous page\n\n'+
					't: Scroll back to top\n'+
					'c: Show config       \n'+
					'r: Show routes       {/#E1DDC8-fg}{/center}'
		},

		config(){
			let content = '{bold}{yellow-fg}Config:{/yellow-fg}{/bold}'

			Object.keys(config).forEach(function(item, key, array) {
				if(config[item] instanceof Object){
					content += '\n\t{bold}'+item+':{/bold}\n'

					if(!(config[item] instanceof Array)){
						Object.keys(config[item]).forEach(function(item2, key, array) {
							content += '\t\t{bold}'+item2+':{/bold} '+config[item][item2]+'\n'
						});
					}

				} else {					
					content += '\n\t{bold}'+item+':{/bold} '+config[item]+'\n'
				}

			});


			return content
		},

		routes(){
			let broken = 0,
				content = '{bold}{yellow-fg}Routes:{/yellow-fg}{/bold}\n\n'

			routes.forEach(function(item, key, array) {
				let msj = ''

				if(item.folder){
					try {
						fs.statSync(path+"/pages/"+item.folder)
					} catch(e){
						console.log(e)
						msj = '{red-fg} Not found!{/red-fg}'
						broken++
					}
					content += '  - '+item.folder+'/ {grey-fg}'+item.title+'{/grey-fg}'+msj+'\n'

					item.items.forEach(function(item, key, array) {
						let tree = (key == array.length-1) ? "    └─ " : "    ├─ "
						content += tree+item.file+' {grey-fg}'+item.title+'{/grey-fg}'+msj+'\n'

					});

				} else {
					try {
						fs.statSync(path+"/pages/"+item.file)
					} catch(e){
						msj = '{red-fg} Not found!{/red-fg}'
						broken++
					}

					content += '  - '+item.file+' {grey-fg}'+item.title+'{/grey-fg}'+msj+'\n'
				}
				content += '\n'
			});

			if(broken > 0){
				content += ' {yellow-fg}There are {/yellow-fg}{red-fg}'+broken+'{red-fg}{yellow-fg}{yellow-fg} elements not found!{/yellow-fg}\n'
				content += ' {grey-fg}You can use{/grey-fg}{cyan-fg} gitowl routes fix {/cyan-fg}{grey-fg} to repair it.{/grey-fg}\n'
			}

			return content
		}
	}

}
