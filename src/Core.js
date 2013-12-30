/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

var Mysql = require('./Mysql');

var Core = function (app, callback) {
  if (Core.instance) {
    if (callback) callback(Core.instance);
    return Core.instance;
  }
  Core.instance = this;

  this.app = app;
  new Mysql(function (response) {
    this.mysql = response;
    if (callback) callback(this);
  }.bind(this));
  return this;
};

exports = Core;
