/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 31.12.13
 */

'use strict';

var _ = require('underscore');
var AppError = require('../../core/AppError');

var UserController = function () {};

_.extend(UserController.prototype, {

  current: function (core, next) {
    var user = core.getCurrentUser();
    if (user) user = user.toJSON();
    core.responseJson({ user: user });
  },

  signUp: function (core, next) {
    core.userManager.hasAccess('signUp', null, function (err, hasAccess) {
      if (err) return next(new AppError(err));
      if (!hasAccess) return core.jsonForbidden();

      var data = JSON.parse(core.post.model);
      core.userManager.signUp(data, function (err, user) {
        if (err) return next(new AppError(err));
        core.responseJson({ user: user });
      });
    })
  },

  signIn: function (core, next) {
    core.userManager.hasAccess('signIn', null, function (err, hasAccess) {
      if (err) return next(new AppError(err));
      if (!hasAccess) return core.jsonForbidden();

      var login = core.post.login;
      var password = core.post.password;
      core.userManager.signIn(login, password, function (err, user) {
        if (err) return next(new AppError(err));
        core.responseJson({ user: user });
      });
    });
  },

  signOut:function (core, next) {
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
  }

});

module.exports = UserController;
