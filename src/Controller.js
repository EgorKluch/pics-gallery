/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var Controller = function () {
  this.scripts = [];
  this.styles = [];
  this.template = null;
};

Controller.prototype.addScript = function (script) {
  script = script.split(':');
  script = '/' + script[0] + '/js/' + script[1];
  if (this.scripts.indexOf(script) === -1) {
    this.scripts.push(script);
  }
};

Controller.prototype.addStyle = function (style) {
  style = style.split(':');
  style = '/' + style[0] + '/css/' + style[1];
  if (this.scripts.indexOf(style) === -1) {
    this.scripts.push(style);
  }
};

Controller.prototype.setTemplate = function (template) {
  template = template.split(':');
  this.template = '/controllers/' + template[0] + '/templates/' + template[1];
};

module.exports = Controller();
