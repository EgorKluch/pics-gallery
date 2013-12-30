/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 30.12.13
 */

'use strict';
  
var User = function (data) {
  this.id = data.id;
  this.login = data.login;
  this.password = data.password;
  this.email = data.email;
  this.role = data.role;
  this.token = data.token;
  this.name = data.name;
  this.second_name = data.second_name;
};

module.exports = User;
