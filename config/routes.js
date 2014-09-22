/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var path = require('path');
var AppError = require('../core/AppError');
var PictureController = require('../controller/picture/pictureController');

module.exports = function (app) {

  var getRouteHandler = function (Controller, method) {
    var controller = new Controller();
    return function (req, res, next) {
      controller[method].call(controller, req.core, next);
    }
  };

  app.use(function (req, res, next) {
    if (0 === req.path.indexOf('/api/')) return next();
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  app.use('/api/pictures', getRouteHandler(PictureController, 'get'));
  app.use('/api/picture/upload', getRouteHandler(PictureController, 'upload'));
};
