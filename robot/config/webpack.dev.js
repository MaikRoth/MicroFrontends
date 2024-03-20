const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common.js')
const { ModuleFederationPlugin } = require('webpack').container
const packageJson = require('../package.json');
const devConfig = {
    mode: 'development',
    output: {
        publicPath: 'http://localhost:4007/',
    },
    devServer: {
        port: 4007,
        historyApiFallback: {
            index: '/index.html'
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new ModuleFederationPlugin({
            name: 'robot',
            filename: 'remoteEntry.js',
            exposes: {
                './RobotApp': './src/bootstrap'
            },
            shared: packageJson.dependencies
        })
    ]
}

module.exports = merge(commonConfig, devConfig)