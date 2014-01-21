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
  var picture = core.req.picture;

  var data = core.getTemplateData('picture/editPicture', 'main/main');
  data.id = picture.id;
  data.title = picture.title;
  data.description = picture.description;

  var template = core.getTemplate('picture:editPicture');
  core.app.render(template, data, function (err, html) {
    if (err) return next(new AppError(err));
    core.responseHtml(html);
  });
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

  core.pictureManager.edit(core.req.picture, data, function (err) {
    if (err) return next(new AppError(err));
    core.responseJson();
  });
};

PictureController.prototype.del = function (core, next) {
  core.pictureManager.del(core.req.picture, function (err) {
    if (err) return next(new AppError(err));
    core.responseJson();
  });
};


module.exports = PictureController;
