/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var _ = require('underscore');
var Core = require('../core/Core');

var core = new Core();
var app = core.app;

var createController = function (path) {
  var Controller = require('../controller/' + path);
  return new Controller();
};


app.get('/', function () {
  var mainController = createController('main/mainController');
  mainController.index();
});

app.get('/signIn', function () {
  var userController = createController('user/userController');
  userController.signIn();
});

app.get('/signOut', function () {
  var userController = createController('user/userController');
  userController.signOut();
});

app.get('/signUp', function () {
  var userController = createController('user/userController');
  userController.signUpPage();
});

app.post('/signUp', function () {
  var userController = createController('user/userController');
  userController.signUp();
});

app.use(function(){
  var mainController = createController('main/mainController');
  mainController.notFound();
});
