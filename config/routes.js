/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var MainController = require('../controller/main/mainController');
var UserController = require('../controller/user/userController');
var PictureController = require('../controller/picture/pictureController');
var Core = require('../core/Core');


var mainController = new MainController();
var userController = new UserController();
var pictureController = new PictureController();


module.exports = function (app) {

  var getRouteHandler = function (context, method) {
    return function (req, res, next) {
      var core = new Core(app, req, res);
      core.initialize(function () {
        method.call(context, core, next);
      });
    }
  };

  app.get('/', getRouteHandler(mainController, mainController.index));

  app.post('/signIn', getRouteHandler(userController, userController.signIn));
  app.all('/signOut', getRouteHandler(userController, userController.signOut));
  app.get('/signUp', getRouteHandler(userController, userController.signUpPage));
  app.post('/signUp', getRouteHandler(userController, userController.signUp));

  app.get('/picture/add', getRouteHandler(pictureController, pictureController.addPage));
  app.post('/picture/add', getRouteHandler(pictureController, pictureController.add));

  app.use(getRouteHandler(mainController, mainController.notFound));
};
