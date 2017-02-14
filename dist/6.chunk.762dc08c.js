webpackJsonp([6,4,8],{

/***/ 416:
/***/ function(module, exports) {

	module.exports = "<header ms-controller=\"header\">\r\n\tthis is header\r\n\t<ul>\r\n\t\t<li ms-repeat=\"navs\">\r\n\t\t\t<a ms-attr-href=\"'#!'+el.url\">{{el.title}}</a>\r\n\t\t</li>\r\n\t</ul>\r\n</header>"

/***/ },

/***/ 418:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(416)
		], __WEBPACK_AMD_DEFINE_RESULT__ = function(sourceHTML){
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
	
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ }

});
//# sourceMappingURL=6.chunk.762dc08c.js.map