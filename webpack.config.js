module.exports = {
  entry: './package/js/src/drooltip.src.js',
  output: {
    filename: './package/js/build/drooltip.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
    ]
  }
};