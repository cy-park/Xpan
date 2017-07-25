const path = require('path');
const webpack = require('webpack');
// const HtmlwebpackPlugin = require('html-webpack-plugin');

const PRODUCTION    = process.env.NODE_ENV === 'production' ? true : false,
	  COMPRESSION   = process.env.WEBPACK_TEMPLATE_COMPRESS === 'true' ? true : false,
	  TEMPLATE_TYPE = process.env.WEBPACK_TEMPLATE_TYPE,
	  LIB_MODE		= process.env.WEBPACK_TEMPLATE_TYPE === 'lib' ? true : false;
const PACKAGE = require('../package.json');
const ROOT_DIR = path.resolve(__dirname, '../');

console.log(PRODUCTION?'___PRODUCTION___':'___DEVELOPMENT___');
console.log(`WEBPACK_TEMPLATE_TYPE: ${process.env.WEBPACK_TEMPLATE_TYPE}`);

module.exports = {

	entry: { main: './src/main.js' },

	output: (function(){

		const _output_ = {
			path: path.resolve(ROOT_DIR, `dist/${TEMPLATE_TYPE}/`)
		};

		if (LIB_MODE) {
			_output_.filename = `${PACKAGE.config.full_name}${COMPRESSION?'.min':''}.js`;
			if (PRODUCTION) {
				// _output_.library = PACKAGE.config.module_name;
				_output_.libraryTarget = 'umd';
				_output_.umdNamedDefine = true;
			}
		}

		return _output_;
	})(),

	devtool: PRODUCTION ? false : 'source-map',

	module: {
		rules: [

			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			}
		]
	},

	resolve: {
		extensions: ['.js', '.jsx', '.json']
	},

	plugins: (function(){
		const plugins = [];

		// if (!PRODUCTION || COMPRESSION) {
		// 	plugins.push(
		// 		new HtmlwebpackPlugin({
		// 			title: PACKAGE.name,
		// 			src: PACKAGE.config.full_name,
		// 			template: `template/index.html`,
		// 			minify: PRODUCTION ? {
		// 				collapseWhitespace: true,
		// 				caseSensitive: true,
		// 				removeComments: true
		// 			} : false
		// 		})
		// 	);
		// }

		if (PRODUCTION) {
			if (COMPRESSION) {
				plugins.push(
					new webpack.optimize.UglifyJsPlugin({
						mangle: {
							props: { regex: /_$/ }
						},
						sourcemap: false
					})
				);
			}
			plugins.push(
				new webpack.BannerPlugin({
					banner: `${PACKAGE.config.full_name}.js v${PACKAGE.version} | (c) ${PACKAGE.config.year_launched}-2017 ${PACKAGE.author} | ${PACKAGE.license} License`,
					entryOnly: true
				})
			);
		}

		return plugins;
	})(),

	devServer: {
		// hot: true,
		// compress: true,
		contentBase: path.resolve(ROOT_DIR, `dist/${TEMPLATE_TYPE}`),
		publicPath: '/',
		host: PACKAGE.config.dev_host,
		port: parseInt(PACKAGE.config.dev_port),
		allowedHosts: [
			'.designbycy.com',
			'.nationalgeographic.com'
		]
	}
};
