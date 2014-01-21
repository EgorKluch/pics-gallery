/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var AppError = require('../../core/AppError');
var Picture = require('../../model/Picture');

var MainController = function () {};

MainController.prototype.index = function (core, next) {

  var data = core.getTemplateData('main/main', 'main/main');

  core.pictureManager.getAll(function (err, pictures) {
    if (err) return next(new AppError(err));

    core.callAsyncMethods(pictures, Picture.prototype.getUser, function (err) {
      if (err) return next(new AppError(err));

      data.pictures = pictures;

      var template = core.getTemplate('picture:pictures');
      core.app.render(template, data, function (err, html) {
        if (err) return next(new AppError(err));
        core.responseHtml(html);
      });
    });
  });
};

MainController.prototype.notFound = function (core, next) {
  core.responseHtmlFromTemplate('main/main', 'main/main', 'main:notFound', next, 404);
};

module.exports = MainController;
