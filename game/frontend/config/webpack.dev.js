const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common');
const { ModuleFederationPlugin } = require('webpack').container;
const packageJson = require('../package.json');

const devConfig = {
  mode: 'development',
  devServer: {
    port: 4001,
    historyApiFallback: {
      index: 'index.html',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new ModuleFederationPlugin({
      name: 'gamecard',
      filename: 'remoteEntry.js',
      exposes: {
        './GameCard': './src/bootstrap',
      },
      shared: packageJson.dependencies,
    }),

  ],
};

module.exports = merge(commonConfig, devConfig);
