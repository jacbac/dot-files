const webpack = require('webpack');
const path = require('path');

const config = {
    entry: {
        app: path.resolve(__dirname, 'app/Resources/assets/front/scripts/app.js'),
        vendor: path.resolve(__dirname, 'app/Resources/assets/front/scripts/vendor.js'),
    },
    output: {
        path: path.resolve(__dirname, 'web/front'),
        publicPath: '/front/',
    },
    module: {
        rules: [
            {
                // only lint local *.vue files
                enforce: 'pre',
                test: /\.vue$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
            },
            {
                // but use vue-loader for all *.vue files
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        scss: 'vue-style-loader!css-loader!sass-loader',
                        sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
                    },
                },
            },
            {
                // only lint local *.js files
                enforce: 'pre',
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
            },
            {
                // use babel-loader for all *.js files
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: ['transform-runtime'],
                    },
                }],
            },
            {
                test: /jquery/,
                use: [
                    { loader: 'expose-loader', options: '$' },
                    { loader: 'expose-loader', options: 'jQuery' },
                ],
            },
            {
                test: /translator/,
                use: [
                    { loader: 'expose-loader', options: 'Translator' },
                ],
            }
        ],
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),

        // https://webpack.js.org/plugins/provide-plugin/
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Translator: 'translator',
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
        }),
    ],
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        modules: ['node_modules'],
        alias: {
            translator: path.resolve(__dirname, './vendor/willdurand/js-translation-bundle/Bazinga/Bundle/JsTranslationBundle/Resources/public/js/translator.min.js'),
            vue: 'vue/dist/vue.js',
            '@': path.resolve(__dirname, './app/Resources'),
            '@components': path.resolve(__dirname, './app/Resources/components'),
            '@front-store': path.resolve(__dirname, './app/Resources/assets/front/scripts/partials/store'),
            '@front-dashboard': path.resolve(__dirname, './app/Resources/assets/front/scripts/partials/dashboard'),
            '@utils': path.resolve(__dirname, './app/Resources/assets/front/scripts/partials/utils'),
        },
    },
};

module.exports = config;
