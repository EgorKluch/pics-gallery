/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var express = require('express');
var config = require('./config/config');
var Core = require('./core/Core');

var app = express();
var core = new Core(app);


app.configure(function(){
  // Config twig
  app.set('views', __dirname + '/templates');
  app.set('view engine', 'twig');
  app.set('twig options', {
    strict_variables: true
  });

  // Set statics dirs (not handlers)
  app.use('/js', express.static('js'));
  app.use('/css', express.static('css'));

  // For POST data
  app.use(express.bodyParser());

  // Init core
  app.use(function (req, res, next) {
    core.initialize(app, req, res, next);
  });

  // Handle request
  require('./config/routes');
  app.use(app.router);
});

app.listen(config.port);
console.log('Express started on port ' + config.port);
