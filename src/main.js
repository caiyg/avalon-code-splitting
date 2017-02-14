var avalon = require("./assets/vendor/avalon/avalon.shim.js");
require("./assets/vendor/oniui/mmPromise/mmPromise")
require("expose?jQuery!jquery");
var root = avalon.define({
	$id:"app"
});
var routers = require("./router.js")
/**
 * 路由全局配置
 */
avalon.state.config({
    onError: function() {
        // console.log(arguments)
    },
    onBegin: function() {
        // console.log(arguments);
        //console.log("arguments",arguments)
        // $(function(){
        //     $("html, body").animate({scrollTop: 1});
        
        // })

        var path = arguments[1].path.split("#");

        console.log(path)

        root.currentStateModel = arguments[1];
        console.log(root.currentStateModel)
        if(path[1]!=undefined){
            location.hash = path[0];
            location.reload()
        }
       


    },
    onViewEnter: function(newNode, oldNode) {
        // console.log(newNode,oldNode)
            // console.log("onViewEnter",newNode,oldNode);
        } // 不建议使用动画，因此实际使用的时候，最好去掉onViewEnter和ms-view元素上的oni-mmRouter-slide

});
avalon.history.start({
    basepath: "/",
    fireAnchor: false
});

//开始扫描编译
avalon.scan();