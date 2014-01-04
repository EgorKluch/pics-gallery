/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var Mysql = require('./Mysql');

var mysql = new Mysql();


var Core = function (app) {
  if (Core.instance) return Core.instance;

  this.app = app;

  return Core.instance = this;
};

Core.prototype.initialize = function (callback) {
  if (this._isInit) {
    if (callback) callback();
    return;
  }
  this._isInit = true;
  mysql.initialize(callback);
};

Core.prototype.initData = function (req, res, next) {
  this.request = req;
  this.response = res;
  this.session = req.session;
  this.post = req.body;
  next();
};

Core.prototype.getPage = function (script, style, template, callback) {
  var data = {
    script: '/js/' + script,
    style: '/css/' + style
  };
  template = 'controller/' + template;
  this.app.render(template, data, function(err, html){
    if (err) throw err;
    callback(html);
  });
};

module.exports = Core;
