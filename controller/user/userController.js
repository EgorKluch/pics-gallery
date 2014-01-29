/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 31.12.13
 */

'use strict';

var AppError = require('../../core/AppError');


var UserController = function () {};

UserController.prototype.signUpPage = function (core, next) {
  core.userManager.hasAccess('signUp', null, function (err, hasAccess) {
    if (err) return next(new AppError(err));
    if (!hasAccess) return core.forbidden();

    var data = { script: 'user/signUp', style: 'main/main' };
    core.responseHtmlFromTemplate('user:signUp', data, next);
  });
};

UserController.prototype.signUp = function (core, next) {
  core.userManager.hasAccess('signUp', null, function (err, hasAccess) {
    if (err) return next(new AppError(err));
    if (!hasAccess) return core.jsonForbidden();

    core.userManager.signUp(core.post, function (err) {
      if (err) return next(new AppError(err));
      core.responseJson();
    });
  });
};

UserController.prototype.signIn = function (core, next) {
  core.userManager.hasAccess('signIn', null, function (err, hasAccess) {
    if (err) return next(new AppError(err));
    if (!hasAccess) return core.jsonForbidden();

    var login = core.post.login;
    var password = core.post.password;
    core.userManager.signIn(login, password, function (err) {
      if (err) return next(new AppError(err));
      core.responseJson();
    });
  });
};

UserController.prototype.signOut = function (core, next) {
  core.userManager.hasAccess('signOut', null, function (err, hasAccess) {
    if (err) return next(new AppError(err));
    if (!hasAccess) return core.jsonForbidden();

    if (!core.userManager.isAuthorized()) {
      return core.forbidden();
    }
    core.userManager.signOut(function (err) {
      if (err) return next(new AppError(err));
      core.responseJson();
    });
  });
};

module.exports = UserController;
