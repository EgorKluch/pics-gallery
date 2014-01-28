/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 18.01.14
 */

'use strict';

var AppError = require('../../core/AppError');

var PictureController = function () {};

PictureController.prototype.upload = function (core, next) {
  if (null === core.userManager.currentUser) {
    return core.forbidden();
  }
  var file = core.files.picture;
  var pictureId = core.post.pictureId;
  this._checkAccessUpload(pictureId, function () {
    core.pictureManager.upload(file, pictureId, function (err, data) {
      if (err) next(new AppError(err));
      core.responseJson(data);
    });
  });
};

PictureController.prototype._checkAccessUpload = function (pictureId, next) {
  if (!pictureId) return next();
  this.getById(pictureId, function (picture) {
    picture.checkAccess('upload', next);
  })
};

PictureController.prototype.addPage = function (core, next) {
  if (null === core.userManager.currentUser) {
    return core.forbidden();
  }
  var data = { script: 'picture/addPicture', style: 'main/main' };
  core.responseHtmlFromTemplate('picture:addPicture', data, next);
};

PictureController.prototype.editPage = function (core, next) {
  var picture = core.req.picture;
  picture.checkAccess('edit', function (err) {
    if (err) return next(new AppError(err));
    var data = {
      script: 'picture/editPicture',
      style: 'main/main',
      id: picture.id,
      title: picture.title,
      description: picture.description
    };
    core.responseHtmlFromTemplate('picture:editPicture', data, next);
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
