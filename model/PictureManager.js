/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 20.01.14
 */

'use strict';

var fs = require('fs');
var util = require('util');
var _ = require('underscore');

var AppError = require('../core/AppError');
var BaseManager = require('../core/BaseManager');
var Picture = require('./Picture');


var PictureManager = function (core) {
  BaseManager.call(this, core, 'picture', Picture);
};

util.inherits(PictureManager, BaseManager);


PictureManager.prototype._getPath = function (filename) {
  return __dirname + '/../public/img/pictures/' + filename;
};

PictureManager.prototype.add = function (data, next) {
  var currentUser = this.core.userManager.currentUser;

  var file = this.files['picture'];
  var filename = _.last(file.path.split('/'));
  fs.rename(file.path, this._getPath(filename), function (err) {
    if (err) return next(new AppError(err));

    var picture = new this.Entity(data);
    picture.filename = filename;
    picture.addedBy = currentUser.id;

    this.mysql.insert(picture.getMysqlData(), next);
  }.bind(this));
};

PictureManager.prototype.edit = function (picture, data, next) {
  _.forEach(data, function (value, key) {
    picture[key] = value;
  });
  picture.save(next);
};

PictureManager.prototype.getAll = function (next) {
  this.mysql.selectAll(function (err, pictures) {
    if (err) return next(new AppError(err));
    pictures = pictures.map(function (picture) {
      return new this.Entity(picture, true);
    }.bind(this));
    next(null, pictures);
  }.bind(this));
};

PictureManager.prototype.del = function (picture, next) {
  this.mysql.del({ id: picture.id }, function (err) {
    if (err) return next(new AppError(err));
    fs.unlink(this._getPath(picture.filename), next);
  }.bind(this));
};


module.exports = PictureManager;
