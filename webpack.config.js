const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/client/index.ts',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/docs'
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'src/client/index.html', to: 'index.html' }, { from: 'src/client/CNAME', to: '' }]
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
