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

		// Append our box to the screen.
		screen.append(box);


		sidebar = blessed.List({
			bottom: 0,
			left: 0,
			padding: 1,
			width: '20%',
			height: '83%',
			interactive: true,
			// keys: true,  // TO FIX
			// mouse: true,   // TO FIX
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


		box.on('scroll', function(data) {
			let perc = Math.trunc(box.getScrollPerc()), msj = ''
			if(perc == 100) msj = "{grey-fg}Press 't' to go top{/grey-fg}   "
			scroll.setContent(msj+perc+'%');
			if(perc == 0) scroll.setContent('');
			screen.render();
		});

		// Add a png icon to the box
	/*	var icon = blessed.image({
		  parent: box,
		  top: 0,
		  left: 0,
		  type: 'overlay',
		  width: 'shrink',
		  height: 'shrink',
		  file: __dirname + '/my-program-icon.png',
		  search: false
		});
*/
		// If our box is clicked, change the content.
/*		box.on('click', function(data) {
		  box.setContent('{center}Some different {red-fg}content{/red-fg}.{/center}');
		  screen.render();
		});

		// If box is focused, handle `enter`/`return` and give us some more content.
		box.key('enter', function(ch, key) {
		  box.setContent('{right}Even different {black-fg}content{/black-fg}.{/right}\n');
		  box.setLine(1, 'bar');
		  box.insertLine(1, 'foo');
			console.log(key.name)
		  screen.render();
		});
*/


		// Quit on Escape, q, or Control-C.
		screen.key(['escape', 'q', 'C-c'], function(ch, key) {
			return process.exit(0);
		});


		var self = this, count = 0 

		screen.key(['right', 'left', 'j', 'k', 'r', 'c', 't', 'h'], function(ch, key) {
			count++ // Fix duplicate keypress
			if(count & 1){ 

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
						console.log(routes)
						break
					case 'c':
						console.log(config)
						break
					case 't':
						box.resetScroll()
						break
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
						sidebar.add(" - "+item2.title)
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
	}

}
