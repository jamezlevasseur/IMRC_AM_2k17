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
    loaders: [
        {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }
    ]
  },
  devtool: 'source-map'
};
