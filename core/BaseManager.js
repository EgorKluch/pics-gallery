/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 20.01.14
 */

'use strict';

var util = require('util');
var _ = require('underscore');

var AppError = require('../core/AppError');
var BaseClass = require('../core/BaseClass');


var BaseManager = function (core, table, Entity) {
  BaseClass.call(this, core);
  this.mysql = this.mysql.assign(table);
  this.Entity = Entity.bind(null, this);
};

util.inherits(BaseManager, BaseClass);


BaseManager.prototype.getById = function (id, next) {
  this.mysql.one(null, { id: id }, function (err, data) {
    if (err) return next(new AppError(err));
    if (!data) return next(null, null);

    try {
      next(null, new this.Entity(data, true));
    } catch (err) { next(new AppError(err)); }

  }.bind(this));
};

BaseManager.prototype.getByFields = function (fields, next) {
  this.mysql.one(null, fields, function (err, data) {
    if (err) return next(new AppError(err));
    if (!data) return next(null, null);

    try {
      return next(null, new this.Entity(data));
    } catch (err) { next(new AppError(err)); }

  }.bind(this));
};

BaseManager.prototype.getByField = function (field, value, next) {
  var fields = {};
  fields[field] = value;
  this.getByFields(fields, next);
};


module.exports = BaseManager;