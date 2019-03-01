const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Merge = require('webpack-merge');
const modules = require('./webpack.modules.js')

module.exports = Merge(modules, {
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: Path.resolve(__dirname, '../')
        }),
    ],
    output: {
        filename: '[name].bundle.js',
        path: Path.resolve(__dirname, 'dist'),
    },
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
    }
});