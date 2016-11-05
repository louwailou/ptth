var webpack = require('webpack');
var path = require('path');

var build_dir = path.resolve(__dirname, './build');

var config = {
	entry: './index.js',
	devtool: 'source-map',
	output: {
		path: build_dir,
		filename: 'ptth.js',
		library: 'ptth',
		libraryTarget: 'umd',
    	umdNamedDefine: true
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components|build)/,
      			loader: 'babel',
      			query: {
			        presets: ['es2015', 'stage-0']
			    }
			}
		]
	}
};

module.exports = config;