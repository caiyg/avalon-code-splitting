define(['text!./home.html'],function(sourceHTML){
	var vm = avalon.define({
		$id:"home",
		alert:"this is home page"
	})
	return avalon.controller(function($ctrl){
		$ctrl.$onRendered = function(){}
		$ctrl.$onEnter = function(){}
		$ctrl.$onBeforeUnload = function(){}
		$ctrl.$vmodels = [vm]
	})
})