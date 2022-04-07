const { merge } = require('webpack-merge');
const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: Path.resolve(__dirname, '../dist'),
        },
        port: 8070,
        historyApiFallback: true
    },
    entry: {
        dev: ['core-js/stable', 'regenerator-runtime/runtime', './dev/index.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './dev/index.html'
        })
    ]
});