/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 31.12.13
 */

'use strict';

var AppError = require('../../core/AppError');


var UserController = function () {};

UserController.prototype.signUpPage = function (core, next) {
  core.responseHtmlFromTemplate('user/signUp', 'main/main', 'user:signUp', next);
};

UserController.prototype.signUp = function (core, next) {
  core.userManager.signUp(function (err) {
    if (err) return next(new AppError(err));
    core.responseJson();
  });
};

UserController.prototype.signIn = function (core, next) {
  core.userManager.signIn(function (err) {
    if (err) return next(new AppError(err));
    core.responseJson();
  });
};

UserController.prototype.signOut = function (core, next) {
  core.userManager.signOut(function (err) {
    if (err) return next(new AppError(err));
    core.responseJson();
  });
};

module.exports = UserController;
