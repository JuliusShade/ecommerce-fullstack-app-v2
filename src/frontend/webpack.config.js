const path = require('path');

module.exports = {
  entry: './src/index.js', // Replace with the path to your main entry file
  output: {
    filename: 'bundle.js', // Replace with the desired output file name
    path: path.resolve(__dirname, 'dist'), // Replace with the desired output directory
  },
  resolve: {
    fallback: {
      buffer: require.resolve('buffer/'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/')
    }
  },
  module: {
    rules: [
      // Add your loaders here (e.g., for JavaScript, CSS, etc.)
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
