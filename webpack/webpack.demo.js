const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');
const modules = require('./webpack.modules.js');

module.exports = merge(modules, {
    entry: {
        demo: ['core-js/stable', 'regenerator-runtime/runtime', './demo/demo.js']
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {from: './rme-build-current/rme.es5.min.js', to: path.resolve(__dirname, '../dist/rme.es5.min.js')}
            ]
        }),
        new HtmlWebpackPlugin({
            template: './demo/demo.html'
        }),
        new CleanWebpackPlugin(),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist'),
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname, '../dist')
        },
        port: 8070
    },
});