/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var util = require('util');

var Core = require('../../core/Core');

var core = new Core();


var MainController = function () {};

MainController.prototype.index = function () {
  var sendMethod = core.response.send.bind(core.response);
  core.getPage('main/main.js', 'main/main.css', 'main/index.twig', sendMethod);
};

MainController.prototype.notFound = function () {
  core.getPage('main/main.js', 'main/main.css', 'main/notFound.twig', function (html) {
    core.response.send(404, html);
  });
};

module.exports = MainController;
