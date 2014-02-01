/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var _ = require('underscore');

var AppError = require('../core/AppError');
var Core = require('../core/Core');
var MainController = require('../controller/main/mainController');
var PictureController = require('../controller/picture/pictureController');
var UserController = require('../controller/user/userController');

var mainController = new MainController();
var userController = new UserController();
var pictureController = new PictureController();


module.exports = function (app) {

  app.use(function(req, res, next){
    req.core = new Core(app, req, res);
    req.core.initialize(next);
  });

  var getRouteHandler = function (context, method) {
    return function (req, res, next) {
      method.call(context, req.core, next);
    }
  };

  app.param('pictureId', function(req, res, next, id){
    req.core.pictureManager.getById(id, function (err, picture) {
      if (err) return next(new AppError(err));

      if (picture) {
        req.picture = picture;
        return next();
      }
      mainController.notFound(req.core, next);
    });
  });

  app.param('pageNumber', function (req, res, next, pageNumber) {
    if (parseInt(pageNumber, 10)) {
      req.pageNumber = pageNumber;
      return next();
    }
    mainController.notFound(req.core, next);
  });

  app.get('/',                            getRouteHandler(mainController, mainController.index));

  app.post('/sign-in',                    getRouteHandler(userController, userController.signIn));
  app.get('/sign-in',                     getRouteHandler(userController, userController.signInPage));
  app.all('/sign-out',                    getRouteHandler(userController, userController.signOut));
  app.get('/sign-up',                     getRouteHandler(userController, userController.signUpPage));
  app.post('/sign-up',                    getRouteHandler(userController, userController.signUp));

  app.get ('/picture/add',                getRouteHandler(pictureController, pictureController.addPage));
  app.post('/picture/add',                getRouteHandler(pictureController, pictureController.add));
  app.post('/picture/upload',             getRouteHandler(pictureController, pictureController.upload));
  app.get ('/picture/:pictureId/edit',    getRouteHandler(pictureController, pictureController.editPage));
  app.post('/picture/:pictureId/edit',    getRouteHandler(pictureController, pictureController.edit));
  app.post('/picture/:pictureId/delete',  getRouteHandler(pictureController, pictureController.del));

  app.get('/testBootstrap',               getRouteHandler(mainController, mainController.testBootstrap));

  app.use(getRouteHandler(mainController, mainController.notFound));
};
