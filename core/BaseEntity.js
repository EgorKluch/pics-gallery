/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 20.01.14
 */

'use strict';

var _ = require('underscore');

var AppError = require('../core/AppError');


var BaseEntity = function (manager) {
  this.manager = manager;
  this.core = this.manager.core;
};

BaseEntity.prototype.save = function (next) {
  var data = this.getMysqlData();
  if (data === null) return new AppError('BaseEntity.getMysqlData is abstract method');
  if (this.id) {
    this.manager.mysql.update({ id: this.id }, data, next);
  } else {
    this.manager.mysql.insert(data, next);
  }
};

BaseEntity.prototype.getMysqlData = function () {
  return null;
};

BaseEntity.prototype.edit = function (id, fields, next) {
  this.getById(id, function (entity, err) {
    if (err) return next(new AppError(err));
    if (entity === null) return next(new AppError('Entity not found'));

    _.forEach(fields, function (value, field) {
      entity[field] = value;
    });

    entity.save(next);
  });
};

BaseEntity.prototype.add = function (data, next) {
  var entity = new this.Entity(data);
  this.mysql.insert(entity.getMysqlData(), next);
};

BaseEntity.prototype.del = function (id, next) {
  this.mysql.del({ id: id }, next);
};

BaseEntity.prototype.transformDataFromMysql = function (data) {
  return _.reduce(data, function (mem, value, key) {
    key = key
      .split('_')
      .map(function (value, index) {
        if (index === 0) return value;
        return value.charAt(0).toUpperCase() + value.slice(1);
      })
      .join('');
    mem[key] = value;
    return mem;
  }, {});
};


module.exports = BaseEntity;
