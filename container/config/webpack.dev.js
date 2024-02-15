const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

const devConfig = {
      mode: 'development',
      devServer: {
          port: 4013,
      },
      plugins: [
          new ModuleFederationPlugin({
              name: 'container',
              remotes: {
                controlpanel: 'controlpanel@http://localhost:4011/remoteEntry.js',
                gamecard: 'gamecard@http://localhost:4001/remoteEntry.js',
                map: 'map@http://localhost:4003/remoteEntry.js',
              },
          }),
          new HtmlWebpackPlugin({
              template: './public/index.html',
          }),
      ],
  };

module.exports = merge(commonConfig, devConfig);