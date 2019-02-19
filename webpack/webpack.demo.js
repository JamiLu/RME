const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Merge = require('webpack-merge');
const modules = require('./webpack.modules.js');

module.exports = Merge(modules, {
    entry: {
        demo: ['@babel/polyfill', './demo/demo.js']
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: './rme-build-current/rme.es5.min.js', to: Path.resolve(__dirname, '../dist/rme.es5.min.js')}
        ]),
        new HtmlWebpackPlugin({
            template: './demo/demo.html'
        }),
        new CleanWebpackPlugin(['dist'], {
            root: Path.resolve(__dirname, '../')
        }),
    ],
    output: {
        filename: '[name].bundle.js',
        path: Path.resolve(__dirname, '../dist'),
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: '../dist',
        port: 8070
    },
});