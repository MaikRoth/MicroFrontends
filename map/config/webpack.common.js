const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');

module.exports = {
  mode: 'development', 
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-react','@babel/preset-env'],
                plugins: ['@babel/plugin-transform-runtime']
            }
        }
    },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: JSON.stringify(true), 
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false), 
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(true), 
    }),
  ],
  resolve: {
    extensions: ['.js', '.vue'],
  },
};
