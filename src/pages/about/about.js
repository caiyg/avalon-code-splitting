define(['text!./about.html'],function(sourceHTML){
	var vm = avalon.define({
		$id:"about",
		toggle:function(){
			$("#message").toggle()
		}
	})
	return avalon.controller(function($ctrl){
		$ctrl.$onRendered = function(){}
		$ctrl.$onEnter = function(){}
		$ctrl.$onBeforeUnload = function(){}
		$ctrl.$vmodels = [vm]
	})
})