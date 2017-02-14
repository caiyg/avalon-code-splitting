define([
"avalon",
"./assets/vendor/oniui/mmRequest/mmRequest",
"./assets/vendor/oniui/mmRouter/mmState",
"./assets/vendor/oniui/cookie/avalon.cookie"
],function(avalon,request,state,cookie){
	var routers = [
		{
			stateName:"home",
			vmName:"app",
			url:"/",
			title:"home",
			template:require("text!./pages/home/home.html"),
			// bundle-loader按需加载
			controller:require("bundle?lazy!./pages/home/home.js")
		},
		{
			stateName:"about",
			vmName:"about",
			url:"/about",
			title:"about",
			template:require("text!./pages/about/about.html"),
			// bundle-loader按需加载
			controller:require("bundle?lazy!./pages/about/about.js")
		},
		{
			stateName:"bbb",
			vmName:"bbb",
			url:"/bbb",
			title:"bbb",
			template:require("text!./pages/bbb/bbb.html"),
			// bundle-loader按需加载
			controller:require("bundle?lazy!./pages/bbb/bbb.js")
		}
	];

	avalon.each(routers,function(i,route){
		avalon.state(route.stateName,{
			url:route.url,
			title:route.title,
			vmName:route.vmName,
			views:{
				"":{
					// 配置模板模块和控制器
					templateProvider:function(){
						return new Promise(function(rs){
							require.ensure([],function(){
								rs(route.template)
							})
						})
					},
					controllerProvider:function(){
						return new Promise(function(rs){
							require.ensure([],function(){
								route.controller(function(file){
									rs(file)
								})
							})
						})
					}
				},
				"header": {
			      	templateProvider: function(){
			      		return new Promise(function(rs){
			      			require.ensure([], function(){
			      				rs(require("text!./pages/header/header.html"))
			      			})
			      		})
			      	},
			      	controllerProvider: function(){
			      		return new Promise(function(rs){
			      			require.ensure([], function(){
			      				var testtt = require("bundle?lazy!./pages/header/header.js");
			      				testtt(function(file){
			      					rs(file)
			      				})
			      			})
			      		})
			      	}
			    }
			}
		})
	})
	return routers
})