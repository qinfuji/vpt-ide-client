let path = require('path');
let resources = require('./scripts/tasks/webpack-resources');

module.exports = resources.createServeConfig({
  entry: './src/index.tsx',

  devServer: {
    port: 9000,
    proxy: [
      {
        changeOrigin: true,
        context: ['/projects'],
        target: 'http://localhost:3000/mock/11'
      },
      {
        changeOrigin: true,
        context: ['/projects/sss']
      }
    ]
  },

  output: {
    filename: 'index.js'
  },

  externals: {},

  resolve: {}
});
