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
  this.roles = data.roles ? data.roles.split('|') : 'user';
  this.name = data.name;
  this.secondName = data.second_name;
};

util.inherits(User, BaseEntity);

_.extend(User.prototype, {

  hasRole: function (role) {
    return this.roles.indexOf(role) !== -1;
  },

  isSuper: function () {
    return this.inRoles('admin', 'moder');
  },

  inRoles: function () {
    if (_.isArray(arguments[0])) {
      return this.inRoles.apply(this, arguments[0]);
    }

    var self = this;
    var roles = Array.prototype.slice.call(arguments);
    return !!_.find(roles, function (role) {
      return self.hasRole(role);
    });
  },

  getMysqlData: function () {
    return {
      id: this.id,
      token: this.token,
      login: this.login,
      password: this.password,
      email: this.email,
      roles: this.roles,
      name: this.name,
      second_name: this.secondName
    };
  },

  toAJAX: function () {
    return {
      id: this.id,
      login: this.login,
      roles: this.roles,
      name: this.name,
      surname: this.secondName
    };
  }
});

module.exports = User;
