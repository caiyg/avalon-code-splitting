define([
	'text!./header.html'
	],function(sourceHTML){
		var vm = avalon.define({
			$id:'header',
			navs:[
				{
					title:'home',
					url:'/'
				},{
					title:'about',
					url:'/about'
				},{
					title:'bbb',
					url:'/bbb'
				}
			]
		})

	})