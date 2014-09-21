/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var cluster = require('cluster');
var os = require('os');

if (cluster.isMaster) {
  var proccessCount = os.cpus().length;
  for (var index = 0; index < proccessCount; index++){
    cluster.fork();
  }

  cluster.on('disconnect', function(worker) {
    console.log('Worker ' + worker.id + ' dies..');
    cluster.fork();
  });

} else {

  var express = require('express');
  var path = require('path');
  var app = express();
  var params = require('express-params');
  var expressDomain = require('express-domain-middleware');
  var bodyParser = require('body-parser');
  var cookieParser = require('cookie-parser');
  var cookieSession = require('cookie-session');
  var AppError = require('./core/AppError');
  var config = require('./config/config');
  var server;

  params.extend(app);

  // Set statics dirs (not handlers)
  app.use('/lib', express.static('public/lib'));
  app.use('/bootstrap', express.static('public/lib/bootstrap'));
  app.use('/js', express.static('public/js'));
  app.use('/app', express.static('public/app'));
  app.use('/css', express.static('public/css'));
  app.use('/img', express.static('public/img'));
  app.use('/tmp/img', express.static('tmp/img'));

  app.use(cookieParser());
  app.use(cookieSession({
    secret: config.cookieKey
  }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(require('connect-multiparty')());

  app.use(expressDomain);

  var Core = require('./core/Core');
  app.use(function(req, res, next){
    req.core = new Core(app, req, res);
    req.core.initialize(next);
  });

  var routesConfig = require('./config/routes');
  routesConfig(app);

  app.use(function (err, req, res, next) {
    if (!err) return;

    var isUnexpectedError = !(err instanceof AppError);
    if (isUnexpectedError) {
      err = new AppError(err);
    }

    if (isUnexpectedError && server._handle) {
      var killtimer = setTimeout(function() {
        process.exit(1);
      }, 60 * 60 * 1000);
      killtimer.unref();

      console.log('Close server');
      server.close(function () {
        console.log('Server was closed');
        process.exit(1);
      });
      cluster.worker.disconnect();
    }

    console.log('\n\n');
    console.error(err.stack);

    res.status(err.status).json(err.getData());
  });

  server = app.listen(config.port);
  console.log('Express started on port ' + config.port);

  server.on('connection', function(socket) {
    socket.setTimeout(30 * 60 * 1000);
  });
}
