/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 18.01.14
 */

'use strict';

var AppError = require('../../core/AppError');

var PictureController = function () {};

PictureController.prototype.addPage = function (core, next) {
  core.responseHtmlFromTemplate('user/signUp', 'main/main', 'user:signUp', next);
};

PictureController.prototype.add = function (core, next) {
  core.pictureManager.add(core.req.body, function (err) {
    if (err) return next(new AppError(err));
    core.responseJson();
  });
};

module.exports = PictureController;
