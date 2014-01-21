/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 31.12.13
 */

'use strict';

var AppError = require('../../core/AppError');


var UserController = function () {};

UserController.prototype.signUpPage = function (core, next) {
  var data = { script: 'user:signUp', style: 'main/main' };
  core.responseHtmlFromTemplate('user/signUp', data, next);
};

UserController.prototype.signUp = function (core, next) {
  core.userManager.signUp(core.post, function (err) {
    if (err) return next(new AppError(err));
    core.responseJson();
  });
};

UserController.prototype.signIn = function (core, next) {
  var login = core.post.login;
  var password = core.post.password;
  core.userManager.signIn(login, password, function (err) {
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
