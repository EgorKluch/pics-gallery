/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 18.01.14
 */

'use strict';

var _ = require('underscore');
var AppError = require('../../core/AppError');

var PictureController = function () {};

_.extend(PictureController.prototype, {
  get: function (core, next) {
    core.pictureManager.get({
      pageNumber: core.query.pageNumber,
      pageSize: core.query.pageSize
    }, function (err, data) {
      if (err) next(new AppError(err));
      core.responseJson(data);
    });
  }
});

PictureController.prototype.upload = function (core, next) {
  var pictureId = core.post.pictureId;
  core.pictureManager.hasAccess('upload', { picture: pictureId }, function (err, hasAccess) {
    if (err) return next(new AppError(err));
    if (!hasAccess) return core.jsonForbidden();

    var file = core.files.file;
    core.pictureManager.upload(file, pictureId, function (err, data) {
      if (err) next(new AppError(err));
      core.responseJson(data);
    });
  });
};

PictureController.prototype.add = function (core, next) {
  core.pictureManager.hasAccess('add', null, function (err, hasAccess) {
    if (err) return next(new AppError(err));
    if (!hasAccess) return core.jsonForbidden();

    var data = JSON.parse(core.post.model);
    data.userId = core.userManager.currentUser.id;

    core.pictureManager.add(data, function (err) {
      if (err) return next(new AppError(err));
      core.responseJson();
    });
  });
};

PictureController.prototype.edit = function (core, next) {
  var picture = core.req.picture;
  core.pictureManager.hasAccess('edit', { picture: picture }, function (err, hasAccess) {
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
  core.pictureManager.hasAccess('delete', { picture: picture }, function (err, hasAccess) {
    if (err) return next(new AppError(err));
    if (!hasAccess) return core.jsonForbidden();

    core.pictureManager.del(picture, function (err) {
      if (err) return next(new AppError(err));
      core.responseJson();
    });
  });
};


module.exports = PictureController;
