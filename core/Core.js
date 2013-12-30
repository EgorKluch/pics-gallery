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

Core.prototype.initialize = function (app, request, response, callback) {
  if (this._isInit) {
    if (callback) callback();
    return;
  }
  this._isInit = true;
  this.request = request;
  this.response = response;
  this.session = request.session;
  this.post = request.body;

  mysql.initialize(callback);
};

Core.prototype.getPage = function (controller, callback) {
  var data = {
    script: '/js/' + controller.script.split(':').join('/'),
    style: '/css/' + controller.style.split(':').join('/')
  };
  var template = 'controller/' + controller.template.split(':').join('/');
  this.app.render(template, data, function(err, html){
    if (err) throw err;
    callback(html);
  });
};

module.exports = Core;
