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
  this.accessHandlers = [];
};

util.inherits(BaseManager, BaseClass);


BaseManager.prototype.getById = function (id, next) {
  var self = this;
  this.mysql.one(null, { id: id }, function (err, data) {
    if (err) return next(new AppError(err));
    if (!data) return next(null, null);
    next(null, new self.Entity(data, true));
  });
};//

BaseManager.prototype.getByFields = function (fields, next) {
  var self = this;
  this.mysql.one(null, fields, function (err, data) {
    if (err) return next(new AppError(err));
    if (!data) return next(null, null);
    return next(null, new self.Entity(data));

  });
};

BaseManager.prototype.getByField = function (field, value, next) {
  var fields = {};
  fields[field] = value;
  this.getByFields(fields, next);
};

BaseManager.prototype.addAccessHandler = function (action, handler) {
  this.accessHandlers[action] = handler;
};

BaseManager.prototype.addAccessHandlers = function (actions, handler) {
  var self = this;
  actions.forEach(function (action) {
    self.addAccessHandler(action, handler);
  });
};

BaseManager.prototype.hasAccess = function (action, args, next) {
  var handler = this.accessHandlers[action];
  if (undefined === this.accessHandlers[action]) return next(null, false);
  if (handler instanceof Function) return handler(handler, args, next);
  next(null, !!handler);
};


module.exports = BaseManager;
