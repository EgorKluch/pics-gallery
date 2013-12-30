/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

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
