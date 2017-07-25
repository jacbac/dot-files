const webpack = require('webpack');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// https://stackoverflow.com/questions/43884201/uglify-cannot-read-property-reset-of-undefined
let config = require('./webpack.config.js');

// Handle the base config's output object and define the final filenames
config.output = config.output || {};
config.output.filename = '[name].min.js'; // '[name].[hash].js';

// Minify the code
// https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
const pluginUglifyJs = new webpack.optimize.UglifyJsPlugin({
    beautify: false,
    compress: {
        screw_ie8: true,
        warnings: false,
    },
    mangle: {
        screw_ie8: true,
        keep_fnames: true,
    },
    comments: false,
    sourceMap: false,
});

// short-circuits all Vue.js warning code
// https://vue-loader.vuejs.org/en/workflow/production.html
const pluginDefine = new webpack.DefinePlugin({
    'process.env': {
        NODE_ENV: '"production"'
    },
});

// Adds a banner to the top of each generated chunk
// https://webpack.js.org/plugins/banner-plugin/
const pluginBanner = new webpack.BannerPlugin({
    banner: 'Copyright (c) 2012-2017',
});

// Handle the base config's plugins array and add the plugins
config.plugins = config.plugins || [];

// @todo loop
config.plugins.push(pluginUglifyJs);
config.plugins.push(pluginBanner);
config.plugins.push(pluginDefine);

module.exports = config;
