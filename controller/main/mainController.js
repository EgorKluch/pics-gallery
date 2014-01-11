/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';


var MainController = function () {};

MainController.prototype.index = function (core, next) {
  core.responseHtmlFromTemplate('main/main', 'main/main', 'main:index', next);
};

MainController.prototype.notFound = function (core, next) {
  core.responseHtmlFromTemplate('main/main', 'main/main', 'main:notFound', next, 404);
};

module.exports = MainController;
