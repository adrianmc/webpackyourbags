var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var production = process.env.NODE_ENV === 'production';

var plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'main',
    children: true,
    minChunks: 2,
  }),
];

if (production) {
  plugins = plugins.concat([
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.MinChunkSizePlugin({
        minChunkSize: 51200, // ~50kb
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle:   true,
      compress: {
        warnings: false, // Suppress uglification warnings
      },
    }),
    new webpack.DefinePlugin({
      __SERVER__:      !production,
      __DEVELOPMENT__: !production,
      __DEVTOOLS__:    !production,
      'process.env':   {
        BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new CleanPlugin('builds'),
  ]);
}

module.exports = {
  debug:   !production,
  devtool: production ? false : 'eval',
  entry: './src',
  output: {
    path: 'builds',
    filename: production ? '[name]-[hash].js' : 'bundle.js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'builds/',
  },
  devServer: {
    hot: true,
  },
  plugins: plugins,
  module: {
    preLoaders: [
      {
        test: /\.js/,
        loader: 'eslint',
      },
    ],
    loaders: [
      {
        test: /\.js/,
        loader: 'babel',
        include: __dirname + '/src',
      },
      {
        test: /\.scss/,
        loaders: ['style', 'css', 'sass'],
      },
      {
        test: /\.html/,
        loader: 'html',
      },
      {
        test: /\.(png|gif|jpe?g|svg)$/i,
        loader: 'url?limit=10000',
      },
    ],
  },
};
