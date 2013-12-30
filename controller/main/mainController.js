/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var util = require('util');

var Controller = require('../../core/Controller');

var MainController = function () {
  Controller.call(this);
};

util.inherits(MainController, Controller);

MainController.prototype.index = function () {
  this.script = 'main:main.js';
  this.style = 'main:main.css';
  this.template = 'main:index.twig';
  return this;
};

MainController.prototype.notFound = function () {
  this.script = 'main:main.js';
  this.style = 'main:main.css';
  this.template = 'main:notFound.twig';
  return this;
};

module.exports = MainController;
