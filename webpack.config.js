module.exports = {
  entry: './package/js/src/drooltip.js',
  output: {
    filename: './package/js/build/drooltip.js',
  },
 devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
    ]
  }
};