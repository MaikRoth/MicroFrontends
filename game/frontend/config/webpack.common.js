module.exports = {
  module: {
    rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
      ],
  },
};
