/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 20.01.14
 */

'use strict';

var util = require('util');

var BaseEntity = require('../core/BaseEntity');


var Picture = function (manager, data) {
  BaseEntity.call(this, manager);

  this.id = data.id;
  this.userId = data.userId;
  this.addedBy = data.addedBy;
  this.filename = data.filename;
  this.title = data.title;
  this.description = data.description;
};

util.inherits(Picture, BaseEntity);


Picture.prototype.getMysqlData = function () {
  return {
    id: this.id,
    user_id: this.userId,
    added_by: this.addedBy,
    filename: this.filename,
    title: this.title,
    description: this.description
  };
};

module.exports = Picture;
