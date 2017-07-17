/*******************************************************************************
 * (c) Copyright 2017 Hewlett Packard Enterprise Development LP Licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance with the License. You
 * may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 *******************************************************************************/
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const srcPath = path.resolve(__dirname, 'src');
const distPath = path.resolve(__dirname, 'dist');
const modulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
  cache: true,
  debug: false,
  devtool: 'cheap-module-source-map',
  entry: {
    app: [path.join(srcPath, 'index.js')],
    vendor: ['react', 'react-dom', 'redux', 'classnames'/*, 'grommet'*/]
  },
  resolve: {
    root: srcPath,
    extensions: ['', '.js', '.jsx', '.json', '.scss', '.svg'],
    modulesDirectories: ['node_modules', 'src'],
    alias: {
      modernizr$: path.resolve(__dirname, ".modernizrrc")
    },
  },
  output: {
    path: distPath,
    publicPath: '',
    filename: '[name].js',
    pathInfo: false
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.modernizrrc$/,
        loader: "modernizr"
      },
      {
        test: /\.json?$/,
        exclude: /node_modules/,
        loader: 'json-loader'
      },
      {
        test: /\.scss?$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style-loader',`css!postcss!sass?outputStyle=compressed&includePaths[]=${modulesPath}`)
      },
      {
        test: /\.svg?$/,
        exclude: /node_modules/,
        loader: 'babel-loader!svg-react'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.NormalModuleReplacementPlugin(/^lodash$/, path.resolve(__dirname, './src/core/litedash')),
    new ExtractTextPlugin('[name].css'),
    new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/index.html'
    }),
    new webpack.NoErrorsPlugin(),
  ],
  eslint: {
    configFile: '.eslintrc'
  },
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ],
  devServer: {
    contentBase: distPath,
    historyApiFallback: true
  }
};
