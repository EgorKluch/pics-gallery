/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 18.01.14
 */

'use strict';

var AppError = require('../../core/AppError');

var PictureController = function () {};

PictureController.prototype.upload = function (core, next) {
  var pictureId = core.post.pictureId;
  core.pictureManager.hasAccess('upload', pictureId, function (err, hasAccess) {
    if (err) return next(new AppError(err));
    if (!hasAccess) return core.jsonForbidden();
    
    var file = core.files.picture;
    core.pictureManager.upload(file, pictureId, function (err, data) {
      if (err) next(new AppError(err));
      core.responseJson(data);
    });
  });
};

PictureController.prototype.addPage = function (core, next) {
  core.pictureManager.hasAccess('add', null, function (err, hasAccess) {
    if (err) return next(new AppError(err));
    if (!hasAccess) return core.forbidden();
    
    var data = { script: 'picture/addPicture', style: 'main/main' };
    core.responseHtmlFromTemplate('picture:addPicture', data, next);
  });
};

PictureController.prototype.editPage = function (core, next) {
  var picture = core.req.picture;
  core.pictureManager.hasAccess('edit', picture, function (err, hasAccess) {
    if (err) return next(new AppError(err));
    if (!hasAccess) return core.forbidden();

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
  core.pictureManager.hasAccess('add', null, function (err, hasAccess) {
    if (err) return next(new AppError(err));
    if (!hasAccess) return core.jsonForbidden();

    var data = core.post;
    data.userId = core.userManager.currentUser.id;

    core.pictureManager.add(data, function (err) {
      if (err) return next(new AppError(err));
      core.responseJson();
    });
  });
};

PictureController.prototype.edit = function (core, next) {
  var picture = core.req.picture;
  core.pictureManager.hasAccess('edit', picture, function (err, hasAccess) {
    if (err) return next(new AppError(err));
    if (!hasAccess) return core.jsonForbidden();

    var data = core.post;
    data.userId = core.userManager.currentUser.id;
    core.pictureManager.edit(picture, data, function (err) {
      if (err) return next(new AppError(err));
      core.responseJson();
    });
  });
};

PictureController.prototype.del = function (core, next) {
  var picture = core.req.picture;
  core.pictureManager.hasAccess('delete', picture, function (err, hasAccess) {
    if (err) return next(new AppError(err));
    if (!hasAccess) return core.jsonForbidden();

    core.pictureManager.del(picture, function (err) {
      if (err) return next(new AppError(err));
      core.responseJson();
    });
  });
};


module.exports = PictureController;
