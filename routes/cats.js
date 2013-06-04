var that;

that = {
  db: null,
  init: function (db) {
    that.db = db;
    return that;
  },
  get: function (req, res) {
    var Cat;
    Cat = that.db.model('Cat');
    Cat.find(function (err, cats) {
      if (err) {
        console.log('err :', err);
        res.writeHead(500, err);
        res.end();
        return;
      }
      if (!cats.length) {
        var cat = new Cat({ name: 'Dizzy' });
        cat.save(function (err) {
          if (err) {
            console.log('err :', err);
            res.writeHead(500, err);
            res.end();
            return;
          }
          res.write('no cats found, a new cat has been created');
          res.end();
        });
      } else {
        cats.forEach(function (cat) {
          res.write('name :' + cat.name + '\n');
        });
        res.end();
      }
    });
  }
};

module.exports = that;