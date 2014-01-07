/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var _ = require('underscore');
var Core = require('../core/Core');

var core = new Core();
var app = core.app;

var subscribe = function (method, url, path) {
  if (method === null || ['get', 'post', 'delete', 'use'].indexOf(method) === -1) {
    throw 'Undefined route method';
  }

  path = path.split(':');
  var Controller = require('../controller/' + path[0]);
  var controller = new Controller();

  var controllerMethod = path[1];
  controllerMethod = controller[controllerMethod].bind(controller);
  app[method](url, core.initData.bind(core), controllerMethod);
};

subscribe('get', '/', 'main/mainController:index');

subscribe('post', '/signIn', 'user/userController:signIn');
subscribe('get', '/signOut', 'user/userController:signOut');
subscribe('get', '/signUp', 'user/userController:signUpPage');
subscribe('post', '/signUp', 'user/userController:signUp');

subscribe('use', '/signUp', 'main/mainController:notFound');
