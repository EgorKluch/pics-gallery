/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var express = require('express');
var app = express();
var params = require('express-params');
params.extend(app);

var AppError = require('./core/AppError');

var config = require('./config/config');

app.configure(function(){
  // Config twig
  app.set('views', __dirname);
  app.set('view engine', 'twig');
  app.set('twig options', {
    strict_variables: true
  });
});

// Set statics dirs (not handlers)
app.use('/js', express.static('public/js'));
app.use('/css', express.static('public/css'));
app.use('/img', express.static('public/img'));

app.use(express.cookieParser());
app.use(express.cookieSession({
  secret: 'Siht si terces yek!'
}));

app.use(express.json());
app.use(express.urlencoded());
app.use(require('connect-multiparty')());

var routesConfig = require('./config/routes');
routesConfig(app);


// Handle errors!
app.use(function (err, req, res, next) {
  if (!err) return;

  if (!(err instanceof AppError)) {
    err = new AppError(err);
  }

  console.log('\n\n');
  console.error(err.stack);

  res.json(err.status, err.getData());
});


app.listen(config.port);
console.log('Express started on port ' + config.port);
