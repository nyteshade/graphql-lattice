var path = require('path');
var fs = require('fs');
var buffer = fs.readFileSync(path.join(__dirname, '.babelrc'));
var babelrc = JSON.parse(buffer.toString())
var webpack = require('webpack')
var UnminifiedWebpackPlugin = require('unminified-webpack-plugin')

module.exports = {
  entry: './src/lattice.js',
  output: {
    filename: 'lattice.min.js',
    path: path.resolve(path.join(__dirname, 'dist'))
  },
  target: 'node',
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: babelrc
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new UnminifiedWebpackPlugin()
  ]
};
