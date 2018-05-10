var glob = require("glob");

module.exports = {
  entry: {
    public: './src/js/core/Public.js',
    admin: './src/js/core/Admin.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/build/js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  stats: {
   warnings: false
  },
  devtool: 'source-map'
};
