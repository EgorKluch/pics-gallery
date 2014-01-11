/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var Core = require('../../core/Core');

var core = new Core();


var MainController = function () {};

MainController.prototype.index = function () {
  core.responseHtmlFromTemplate('main/main.js', 'main/main.css', 'main/index.twig');
};

MainController.prototype.notFound = function () {
  core.responseHtmlFromTemplate('main/main.js', 'main/main.css', 'main/notFound.twig', 404);
};

module.exports = MainController;
