/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var express = require('express');

var config = require('./config/config');

var app = express();
app.configure(function(){
  // Config twig
  app.set('views', __dirname + '/templates');
  app.set('view engine', 'twig');
  app.set('twig options', {
    strict_variables: true
  });
  app.use('/js', express.static('js'));
  app.use('/css', express.static('css'));
});

require('./config/routes')(app);

app.listen(config.port);
console.log('Express started on port ' + config.port);
