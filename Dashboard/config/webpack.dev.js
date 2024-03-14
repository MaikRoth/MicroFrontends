const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');
const packageJson = require('../package.json');

const devConfig = {
    mode: 'development',
    output: {
        publicPath: 'http://localhost:4013/',
    },
    devServer: {
        port: 4013,
        historyApiFallback: {
            index: '/index.html',
        },
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'dashboard',
            remotes: {
                gamecard: 'gamecard@http://localhost:4001/remoteEntry.js',
                map: 'map@http://localhost:4003/remoteEntry.js',
                scoreboard: 'scoreboard@http://localhost:4005/remoteEntry.js',
                robot: 'robot@http://localhost:4007/remoteEntry.js',
            },
            shared: packageJson.dependencies,

        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
};

module.exports = merge(commonConfig, devConfig);