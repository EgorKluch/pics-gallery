/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 20.01.14
 */

'use strict';

var util = require('util');

var BaseManager = require('../core/BaseManager');
var Picture = require('./Picture');


var PictureManager = function (core) {
  BaseManager.call(this, core, 'picture', Picture);
};

util.inherits(PictureManager, BaseManager);


PictureManager.prototype.add = function (data, next) {
  var currentUser = this.core.userManager.currentUser;

  var picture = new Picture(data);
  picture.addedBy = currentUser.id;

  // TODO: загружаем и сохраняем изображение картины

  this.mysql.insert('picture', picture.getMysqlData(), next);
};


module.exports = PictureManager;
