var path = require('path')
  , mongoose = require('mongoose')
  , baseDir, that;

baseDir = path.join(__dirname, '..');

function simpleRenderer(view) {
  return function (req, res) {
    res.render(path.join(baseDir, 'views', view));
  };
}

that = {
  init: function (app, db) {
    var cats = require('./cats');
    console.log('routes init');
    cats.init(db);
    app.get('/', simpleRenderer('home'));
    app.get('/cats', cats.get);
  }
};

module.exports = that;