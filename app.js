var pkg = require('./package')
  , util = require('util')
  , path = require('path')
  , http = require('http')
  , express = require('express')
  , ejs = require('ejs')
  , socketIo = require('socket.io')
  , baseDir, db, server, io, app;

baseDir = __dirname;

(function () {
  var mongoose = require('mongoose')
    , Cat;
  console.log('connect db');
  db = mongoose.connect(
    util.format(
      'mongodb://%s:%s@localhost/nh_%s',
      process.env['NODESHUB_USERNAME'],
      process.env['NODESHUB_MONGODB_PASSWORD'],
      process.env['NODESHUB_USERNAME']
    ), function () {
      mongoose.model('Cat', { name: String });
    });
})();

(function () {
  console.log('configure express server');
  app = express();
  app.set('env', process.env.NODE_ENV || 'development');
  app.set('port', 3000);
  app.set('views', path.join(baseDir, 'views'));
  app.engine('html', ejs.renderFile);
  app.set('view engine', 'html');
  app.use(express.favicon());
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
/*
  app.use(express.cookieParser());
  app.use(express.session({ secret: pkg.name }));
 */
  app.use(app.router);
  app.use(require('less-middleware')({
    src: path.join(baseDir, 'less'),
    dest: path.join(baseDir, 'assets', 'css'),
    prefix: '/assets/css',
    once: true,
    compress: true,
    optimization: 2,
    debug: true
  }));
  app.use('/assets', express.static(path.join(baseDir, 'assets')));
  app.use(express.errorHandler());
  require(path.join(baseDir, 'routes')).init(app, db);
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.send(500, 'Something broke!');
  });
  app.use(function (req, res) {
    res.send(404, 'Resource not found');
  });
})();

(function () {
  console.log('start server');
  server = http.createServer(app);
  io = socketIo.listen(server, {
    log: true,
    transports: ['websocket']
  });
  server.listen(3000, function () {
    console.log('express server ready');
  });
})();

(function () {
  console.log('configure web sockets middleware');
  io.sockets.on('connection', function (socket) {
    console.log('new ws connection!');
    setInterval(function () {
      socket.emit('hello', 'it works!');
    }, 5000);
  });
})();