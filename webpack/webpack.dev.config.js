const webpack = require('webpack');
const path = require('path');
let config = require('./webpack.config.js');

config.watch = true;

// Handle the base config's entry object and define the filenames
config.entry = config.entry || {};
// config.entry.server = 'webpack-dev-server/client?http://localhost:8080/';

// Handle the base config's output object and define the filenames
config.output = config.output || {};
config.output.filename = '[name].min.js';
// config.output.publicPath = 'http://localhost:8080';

// Handle the base config's devServer object and define the ...
// config.devServer = config.devServer || {};
// config.devServer = {
//     hot: true, // enables hot reload
//     // inline: true, // use inline method for hmr

//     host: 'localhost',
//     port: 8080,

//     // We need to tell Webpack to serve our bundled application
//     // from the build path. When proxying:
//     // http://localhost:3000/front -> http://localhost:8080/front
//     publicPath: '/front/',
//     contentBase: path.resolve(__dirname, 'web/front'), // should point to the symfony public front folder

//     // The rest is terminal configurations
//     quiet: false,
//     noInfo: true,
//     stats: {
//       colors: true,
//     },
// };

// https://webpack.js.org/plugins/hot-module-replacement-plugin/
// const pluginHotModuleReplacement = new webpack.HotModuleReplacementPlugin();

// Handle the base config's plugins array and add the plugins
config.plugins = config.plugins || [];
// config.plugins.push(pluginHotModuleReplacement);

module.exports = config;
