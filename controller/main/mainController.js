/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var AppError = require('../../core/AppError');
var Picture = require('../../model/Picture');


var MainController = function () {
  if (MainController.instance) return MainController.instance;
  return MainController.instance = this;
};

MainController.prototype.index = function (core, next) {
  core.pictureManager.getAll(function (err, pictures) {
    if (err) return next(new AppError(err));

    core.callAsyncMethods(pictures, Picture.prototype.getUser, function (err) {
      if (err) return next(new AppError(err));

      var data = { script: 'main/main', style: 'main/main', pictures: pictures };
      core.responseHtmlFromTemplate('picture:pictures', data, next);
    });
  });
};

MainController.prototype.notFound = function (core, next) {
  var data = { script: 'main/main', style: 'main/style' };
  core.responseHtmlFromTemplate('main:notFound', data, next, 404);
};

module.exports = MainController;
