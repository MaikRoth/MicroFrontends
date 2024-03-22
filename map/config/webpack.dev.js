const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common')
const { ModuleFederationPlugin } = require('webpack').container
const packageJson = require('../package.json');
const devConfig = {
    mode: 'development',
    output: {
        publicPath: 'http://localhost:4003/',
    },
    devServer: {
        port: 4003,
        historyApiFallback: {
            index: '/index.html'
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new ModuleFederationPlugin({
            name: 'map',
            filename: 'remoteEntry.js',
            exposes: {
                './MapApp': './src/bootstrap'
            },
            shared: packageJson.dependencies
        })
    ]
}

module.exports = merge(commonConfig, devConfig)