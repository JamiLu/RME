const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Merge = require('webpack-merge');
const modules = require('./webpack.modules.js');

module.exports = Merge(modules, {
    entry: {
        calculator: ['@babel/polyfill', './calculator/calculator.js']
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: './rme-build-current/rme.js', to: Path.resolve(__dirname, '../dist/')}
        ]),
        new HtmlWebpackPlugin({
            template: './calculator/calculator.html'
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
        port: 8070,
        historyApiFallback: true,
    },
});