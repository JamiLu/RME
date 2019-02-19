const Merge = require('webpack-merge');
const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = Merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: '../dist',
        port: 8070,
        historyApiFallback: true
    },
    entry: {
        dev: ['@babel/polyfill', './dev/index.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './dev/index.html'
        })
    ]
});