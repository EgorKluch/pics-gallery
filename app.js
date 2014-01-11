/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var express = require('express');
var app = express();

var Core = require('./core/Core');
var core = new Core(app);
var config = require('./config/config');


app.configure(function(){
  // Config twig
  app.set('views', __dirname + '/templates');
  app.set('view engine', 'twig');
  app.set('twig options', {
    strict_variables: true
  });
});

// Set statics dirs (not handlers)
app.use('/js', express.static('build/js'));
app.use('/css', express.static('build/css'));

app.use(express.cookieParser());
app.use(express.cookieSession({
  secret: 'Siht si terces yek!'
}));
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);

require('./config/routes');

core.initialize(function () {
  app.listen(config.port);
  console.log('Express started on port ' + config.port);
});
