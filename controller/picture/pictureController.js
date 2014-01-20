/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 18.01.14
 */

'use strict';

var AppError = require('../../core/AppError');

var PictureController = function () {};


PictureController.prototype.addPage = function (core, next) {
  core.responseHtmlFromTemplate('picture/addPicture', 'main/main', 'picture:addPicture', next);
};

PictureController.prototype.editPage = function (core, next) {
  core.responseHtmlFromTemplate('picture/editPicture', 'main/main', 'picture:editPicture', next);
};


PictureController.prototype.add = function (core, next) {
  var data = core.post;
  data.userId = core.userManager.currentUser.id;

  core.pictureManager.add(data, function (err) {
    if (err) return next(new AppError(err));
    core.responseJson();
  });
};

PictureController.prototype.edit = function (core, next) {
  var data = core.post;
  data.userId = core.userManager.currentUser.id;

  core.pictureManager.edit(core.args.id, data, function (err) {
    if (err) return next(new AppError(err));
    core.responseJson();
  });
};

PictureController.prototype.del = function (core, next) {
  core.pictureManager.del(core.args.id, function (err) {
    if (err) return next(new AppError(err));
    core.responseJson();
  });
};


module.exports = PictureController;
