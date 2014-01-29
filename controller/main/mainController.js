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
  var data = {
    script: 'main/main',
    style: 'main/main',
    title: 'Страница не найдена',
    message: 'Данной страницы не существует.'
  };
  core.responseHtmlFromTemplate('main:error', data, next, 404);
};

MainController.prototype.forbidden = function (core, next) {
  var data = {
    script: 'main/main',
    style: 'main/main',
    title: 'Ошибка доступа',
    message: 'Доступ к данной странице запрещен.'
  };
  core.responseHtmlFromTemplate('main:error', data, next, 403);
};

module.exports = MainController;
