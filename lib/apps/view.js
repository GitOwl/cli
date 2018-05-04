var fs       = require('fs-extra'),
	color    = require('chalk'),
	inquirer = require('inquirer'),
	blessed  = require('blessed');

var content, files, screen, box, sidebar

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
			padding:  2,
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
			keys: true,
			mouse: true,
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
					bg: '#f8f8f8',
					fg: 'black'
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
			content: '{#f0f0f0-fg}{bold}GitOwl{bold}{/#f0f0f0-fg}\n\n{#E1DDC8-fg}Press esc to quit{/#E1DDC8-fg}',
			align: 'center',
			valign: 'middle',
			tags: true,
			border: {
				type: 'line'
			},
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


		var count = 0 

		screen.key(['right', 'left'], function(ch, key) {
			console.log(count++)
			// NOTA: tomar solo si es par
			//console.log(key.name)
			//console.log(ch)
			//return process.exit(0);
			box.setContent(key.name);
 			screen.render();
		});

		// box.key(['right', 'left'], function(ch, key) {
		// 	console.log(key.name)
		// 	//console.log(ch)
		// 	//return process.exit(0);
		// 	box.setContent(key.name);
 	// 		screen.render();
		// });


		box.focus();
		screen.render();

	},

	content(){

		files = []
		
		routes.forEach(function(item, key, array) {
			if(item.folder){
				try {
					fs.statSync(path+"pages/"+item.folder)
					files.push(path+"pages/"+item.folder+"/chapter.md")
					sidebar.add(item.folder)

					item.items.forEach(function(item2, key, array) {
						files.push(path+"pages/"+item.folder+'/'+item2.file)
						sidebar.add("  "+item2.title)
					});
				} catch(e){
					// console.log(e)
				}

			} else {
				try {
					fs.statSync(path+"pages/"+item.file)
					files.push(path+"pages/"+item.file)
					sidebar.add(item.title)

				} catch(e){
					// console.log(e)
				}

			}
		});

		this.page(1)
	},

	page(id){
		let marked = require('marked'),
			TerminalRenderer = require('marked-terminal');

		marked.setOptions({
			renderer: new TerminalRenderer()
		});

		// console.log(marked('# Hello \n This is **markdown** printed in the `terminal`'))


		fs.readFile(files[id], "utf8", function read(err, data) {
			if (err) {
				content = marked(err)
			} else {
				content = marked(data)

				// box.setContent(files.toString());
				// screen.render();
			}
			box.setContent(content);
 			screen.render();
		});
	}






}
