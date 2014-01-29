/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 30.12.13
 */

'use strict';

var util = require('util');
var _ = require('underscore');

var BaseEntity = require('../core/BaseEntity');


var User = function (manager, data) {
  BaseEntity.call(this, manager);

  this.id = data.id ? data.id : null;
  this.token = data.token ? data.token : null;

  this.login = data.login;
  this.password = data.password;
  this.email = data.email;
  this.role = data.role;
  this.name = data.name;
  this.secondName = data.second_name;
};

util.inherits(User, BaseEntity);

User.prototype.hasRole = function (role) {
  return role === this.role;
};

User.prototype.inRoles = function () {
  if (arguments[0] instanceof Array) {
    return this.inRoles.apply(this, arguments[0]);
  }

  var self = this;
  var roles = Array.prototype.slice.call(arguments);
  return !!_.find(roles, function (role) {
    return self.hasRole(role);
  });
};

User.prototype.getMysqlData = function () {
  return {
    id: this.id,
    token: this.token,
    login: this.login,
    password: this.password,
    email: this.email,
    role: this.role,
    name: this.name,
    second_name: this.secondName
  };
};

module.exports = User;
