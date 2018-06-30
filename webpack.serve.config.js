let path = require('path');
let resources = require('./scripts/tasks/webpack-resources');

module.exports = resources.createServeConfig({
  entry: './src/index.tsx',

  devServer: {
    port: 9000,
    before: function(app) {
      app.get('/projects/:id', function(req, res) {
        let { fetchProjectData } = require(path.join(__dirname, './src/mocks/fetchProjectData'));
        let id = req.params.id;
        let ret = {};
        try {
          ret = fetchProjectData(id);
        } finally {
          delete require.cache[path.join(__dirname, './src/mocks/fetchProjectData.js')];
        }

        res.json(ret);
      });
    },
    proxy: [
      {
        changeOrigin: true,
        context: ['/projects'],
        target: 'http://localhost:3000/mock/11'
      }
    ]
  },

  output: {
    filename: 'index.js'
  },

  externals: {},

  resolve: {}
});
