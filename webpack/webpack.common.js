const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
const modules = require('./webpack.modules.js')

module.exports = merge(modules, {
    plugins: [
        new CleanWebpackPlugin(),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
    }
});