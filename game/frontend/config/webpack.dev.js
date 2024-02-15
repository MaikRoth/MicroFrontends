const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const { ModuleFederationPlugin } = require('webpack').container;

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
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    }),
    new VueLoaderPlugin(),
    new ModuleFederationPlugin({
      name: 'gamecard',
      filename: 'remoteEntry.js',
      exposes: {
        './GameCard': './src/bootstrap',
      }
    }),

  ],
};

module.exports = merge(commonConfig, devConfig);
