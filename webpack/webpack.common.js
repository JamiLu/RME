const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Merge = require('webpack-merge');
const modules = require('./webpack.modules.js')

module.exports = Merge(modules, {
    plugins: [
        new CopyWebpackPlugin([
            {from: './rme-v1.2.0-bundle/rme.js', to: Path.resolve(__dirname, './dist/')}
        ]),
        // // new HtmlWebpackPlugin({
        // //     template: './src/index.html'
        // // }),
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