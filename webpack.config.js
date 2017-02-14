var path = require('path');
var webpack = require('webpack');
// 提取组件中的样式
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// html模板
var HtmlWebpackPlugin = require('html-webpack-plugin');

var plugins = [
	new webpack.optimize.CommonsChunkPlugin({
		name:"commons",
		filename:"commons.js",
		minChunks:3
	}),
	new HtmlWebpackPlugin({
		template:'tpl.html',
		filename:'index.html',
		hash:true
	}),
	new ExtractTextPlugin("style.css",{
		allChunks:true,
		disable:false
	}),
	// 使用 ProvidePlugin 加载使用率高的依赖库
	new webpack.ProvidePlugin({
	    $: "jquery",
	    jQuery: "jquery"
	})
]
var entry = {
	app:'./src/main.js',
	vendor:['avalon','jquery']
},
buildPath = "/dist";
module.exports = {
	debug:true,
	entry:entry,
	output:{
		path:__dirname + buildPath,
		publicPath:'',
		filename:'[name].js',
		chunkFilename:'[name].chunk.[chunkhash:8].js'//给require.ensure用
	},
	module:{
		loaders:[
			{
		      test: /\.css$/,
		      loader: ExtractTextPlugin.extract(
		        "style-loader", "css-loader?sourceMap!cssnext-loader")
		    }, {
		            test: /\.less$/,
		            loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap&root=src/assets/css!less-loader?sourceMap')
		    }, {
		      test: /\.(jpg|png|gif)$/,
		      loader: "file-loader?name=images/[name].[hash].[ext]"
		    }, {
		      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
		      loader: "url-loader?limit=10000&minetype=application/font-woff"
		    }, {
		      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
		      loader: "file-loader"
		    }, {
		      test: /\.json$/,
		      loader: "json"
		    }, {
		      test: /\.coffee$/,
		      loader: "coffee-loader"
		    }, {
		      test: /\.(coffee\.md|litcoffee)$/,
		      loader: "coffee-loader?literate"
		    }],
		    preLoaders: [{
		      test: /\.js$/,
		      loader: "require-css-preloader"
		    }
		]
	},
	resolve:{
		root:path.resolve('src'),

		// require时省略的扩展名，如：require('module') 不需要module.js
	    extension: ['', '.js', '.css','.less',".coffee","json"],
	    //别名
	    alias: {
		      mmRequest: path.join(__dirname, "src/assets/vendor/oniui/mmRequest/mmRequest"),
		      mmPromise: path.join(__dirname, "src/assets/vendor/oniui/mmPromise/mmPromise"),
		      mmHistory: path.join(__dirname, "src/assets/vendor/oniui/mmRouter/mmHistory"),
		      mmRouter: path.join(__dirname, "src/assets/vendor/oniui/mmRouter/mmRouter"),
		      mmState: path.join(__dirname, "src/assets/vendor/oniui/mmRouter/mmState"),
		      cookie: path.join(__dirname, "src/assets/vendor/oniui/cookie/avalon.cookie"),
		      datepicker: path.join(__dirname, "src/assets/vendor/oniui/datepicker/avalon.datepicker"),
		      camera: path.join(__dirname, "src/assets/vendor/oniui/camera/avalon.camera"),
		      coupledatepicker: path.join(__dirname, "src/assets/vendor/oniui/datepicker/avalon.coupledatepicker"),
		      pager: path.join(__dirname, "src/assets/vendor/oniui/pager/avalon.pager"),
		      dialog: path.join(__dirname, "src/assets/vendor/oniui/dialog/avalon.dialog"),
		      tab: path.join(__dirname, "src/assets/vendor/oniui/tab/avalon.tab"),
		      qrcode : path.join(__dirname,"src/assets/vendor/jquery.qrcode.min"),
		      validation: path.join(__dirname, "src/assets/vendor/oniui/validation/avalon.validation"),
		      avalon: path.join(__dirname, 'src/assets/vendor/avalon/avalon.shim'), //在正常情况下我们以CommonJS风格引用avalon,以require('avalon')
		      // 'ready!': avalon.ready,
		      jwplayer: path.join(__dirname, 'src/assets/vendor/jwplayer'),
		      '../avalon': path.join(__dirname, 'src/assets/vendor/avalon/avalon.shim') //由于oniui都以是../avalon来引用avalon的，需要在这里进行别名
		}
	},
	plugins:plugins,
	devtool:'#source-map'
};