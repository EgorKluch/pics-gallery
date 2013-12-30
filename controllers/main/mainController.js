/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var util = require('util');

var Controller = require('../../src/Controller');

var MainController = function () {
  Controller.call(this);
};

util.inherits(MainController, Controller);

MainController.prototype.index = function () {
  this.addScript('main:main.js');
  this.addStyle('main:main.css');
  this.setTemplate('main:index.twig');
};

module.exports = MainController;
