const path=require('path');
const webpack=require('webpack');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { ReactLoadablePlugin } =require('react-loadable/webpack') ;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const isServer=process.env.BUILD_TYPE==='server';
const rootPath=path.join(__dirname,'../');
const theme = require('../package.json').theme;
const config = require('./config');

const prodConfig={
  context: path.join(rootPath,'./src'),
  entry: {
    client:'./index.js',
    vendors:['react','react-dom','react-loadable','react-redux','redux','react-router-dom','react-router-redux','redux-thunk', 'react-helmet'],
  },
  output:{
    filename:'js/[name].[hash:8].js',
    path:path.resolve(rootPath,'./dist'),
    publicPath:'/',
    chunkFilename: 'js/[name]-[hash:8].js',
    // libraryTarget: isServer?'commonjs2':'umd',
  },
  resolve:{
    extensions:[".js",".jsx",".css",".less",".scss",".png",".jpg"],
    modules:[path.resolve(rootPath, "src"), "node_modules"],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'config': path.resolve(__dirname, '../config'),
    }
  },
  module:{
    rules:[
      {
        test:/\.jsx?$/,
        exclude: /node_modules/,
        include:path.resolve(rootPath, "src"),
        use:{
          loader:'babel-loader',
          options:{
            presets: ['env', 'react', 'stage-0'],
            plugins: [
              'transform-runtime',
              'add-module-exports',
              ["import", [{ "style": true,libraryDirectory: 'es', "libraryName": "antd-mobile" }]]
            ],
            cacheDirectory: true,
          }
        }
      },{
        test: /\.less$/i, 
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',//css-loader 是处理css文件中的url(),require()等
              options: {
                minimize: true,
                // importLoaders: 1,
                // modules: true,
                // localIdntName: config.cssModulesClass,
              }
            },
            {
              loader: 'postcss-loader', 
              options: {
                plugins: () => [require("autoprefixer")({ browsers: 'last 5 versions' })],
                minimize: true,
              } 
            }, 
            {
              loader: 'less-loader', 
              options: {
                minimize: true,
                modifyVars: theme
              }
            }
            
          ]
        })
      }, {
        test: /\.css$/i, use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',//css-loader 是处理css文件中的url(),require()等
              options: {
                minimize: true,
                // importLoaders: 1,
                // modules: true,
                // localIdentName: config.cssModulesClass,
              }
            }, 
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [require("autoprefixer")({ browsers: 'last 5 versions' })],
                minimize: true,
              } 
            }
          ]
        })
      },{
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        exclude:/node_modules/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: 'img/[hash:base64:32].[ext]'
          }
        }
      }
    ]
  },
  plugins:[
    new ManifestPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({
      filename: 'css/style.[hash].css',
      allChunks: true,
    }),
    new CopyWebpackPlugin([{from:'favicon.ico',to:rootPath+'./dist'}]),
    new CleanWebpackPlugin(['./dist'],{root: rootPath,}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV':JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
      filename:'index.html',
      template:'./index.ejs',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name:['vendors','manifest'],
      minChunks:2
    }),
    new ReactLoadablePlugin({
      filename: path.join(rootPath,'./dist/react-loadable.json'),
    }),
  ]
}

module.exports=prodConfig