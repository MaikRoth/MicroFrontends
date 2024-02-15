const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common')
const { ModuleFederationPlugin } = require('webpack').container

const devConfig = {
    mode: 'development',
    devServer: {
        port: 4003,
        historyApiFallback: {
            index: 'index.html'
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
        })
    ]
}

module.exports = merge(commonConfig, devConfig)