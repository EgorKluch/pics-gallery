/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var util = require('util');

var Core = require('../../core/Core');

var core = new Core();


var MainController = function () {};

MainController.prototype.index = function (req, res) {
  core.getPage('main/main.js', 'main/main.css', 'main/index.twig', function (html) {
    res.send(html);
  });
};

MainController.prototype.notFound = function (req, res) {
  core.getPage('main/main.js', 'main/main.css', 'main/notFound.twig', function (html) {
    res.send(404, html);
  });
};

module.exports = MainController;
