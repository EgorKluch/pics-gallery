/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 20.01.14
 */

'use strict';

var util = require('util');
var _ = require('underscore');

var AppError = require('../core/AppError');
var BaseEntity = require('../core/BaseEntity');


var Picture = function (manager, data, mysqlData) {
  BaseEntity.call(this, manager);

  if (mysqlData) data = this.transformDataFromMysql(data);

  this.id = data.id;
  this.userId = data.userId;
  this.addedBy = data.addedBy;
  this.filename = data.filename;
  this.src = '/img/pictures/' + data.filename;
  this.url = '/picture/' + data.id;
  this.title = data.title;
  this.description = data.description;
};

util.inherits(Picture, BaseEntity);

_.extend(Picture.prototype, {
  getUser: function (next) {
    if (this.user) {
      next(null, this.user);
    }

    this.core.userManager.getById(this.userId, function (err, user) {
      if (err) return next(new AppError(err));
      this.user = user;
      next(null, user);
    }.bind(this));
  },

  getMysqlData: function () {
    return {
      id: this.id,
      user_id: this.userId,
      added_by: this.addedBy,
      filename: this.filename,
      title: this.title,
      description: this.description
    };
  }
});

module.exports = Picture;
