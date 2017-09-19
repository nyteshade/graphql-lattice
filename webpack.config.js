var path = require('path');
var fs = require('fs');
var buffer = fs.readFileSync(path.join(__dirname, '.babelrc'));
var babelrc = JSON.parse(buffer.toString())
var webpack = require('webpack')
var UnminifiedWebpackPlugin = require('unminified-webpack-plugin')

module.exports = {
  entry: './es6/lattice.js',
  devtool: 'source-map',
  output: {
    libraryTarget: 'commonjs',
    filename: 'lattice.js',
    path: path.resolve(path.join(__dirname, 'dist'))
  },
  target: 'node',
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    "graphql": { commonjs: "graphql", commonjs2: "graphql" },
    "express-graphql": { commonjs: "express-graphql", commonjs2: "express-graphql" }
  },
  plugins: []
  //   new webpack.optimize.UglifyJsPlugin({
  //     parallel: true,
  //     
  //     uglifyOptions: {
  //       mangle: false,
  //       compress: {
  //         properties: false,
  //         dead_code: false,
  //         drop_debugger: true,
  //         ecma: 6,
  //         typeofs: false,
  //         unused: false,
  //         toplevel: false,
  //         pure_getters: false          
  //       },
  //       output: {
  //         bracketize: true,
  //         comments: false,
  //         ecma: 6,
  //         indent_level: 2,
  //         keep_quoted_props: true,
  //         quote_style: 3,
  //         wrap_iife: true
  //       }
  //     }
  //   }),
  //   new UnminifiedWebpackPlugin(),
  //   new webpack.optimize.AggressiveMergingPlugin()
  // ]
};
