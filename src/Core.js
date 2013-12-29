/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

var Mysql = require('./Mysql');

var config = require('./config/config');

var Core = function (callback) {
  if (Core.instance) {
    if (callback) callback(Core.instance);
    return Core.instance;
  }
  Core.instance = this;

  new Mysql(function (response) {
    this.mysql = response;
    if (callback) callback(this);
  }.bind(this));
  return this;
};

exports = Core;
