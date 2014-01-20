/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 20.01.14
 */

'use strict';

var util = require('util');

var BaseClass = require('../core/BaseClass');
var AppError = require('../core/AppError');
var Picture = require('./Picture');


var PictureManager = function (core) {
  BaseClass.call(this, core);
};

PictureManager.prototype.add = function (data, next) {
  var currentUser = this.core.userManager.currentUser;

  var picture = new Picture(data);
  picture.addedBy = currentUser.id;
  // TODO: загружаем и сохраняем изображение картины

  this.mysql.insert('picture', picture.getMysqlData(), function (err) {
    if (err) return next(new AppError(err));
  });
};

util.inherits(PictureManager, BaseClass);

module.exports = PictureManager;
