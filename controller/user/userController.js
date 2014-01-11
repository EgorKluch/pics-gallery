/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 31.12.13
 */

'use strict';

var Core = require('../../core/Core');
var UserManager = require('../../model/UserManager');

var core = new Core();
var userManager = new UserManager();


var UserController = function () {};

UserController.prototype.signUpPage = function () {
  core.responseHtmlFromTemplate('user/signUp', 'main/main', 'user:signUp');
};

UserController.prototype.signUp = function (next) {
  userManager.signUp(function (err) {
    if (err) return next(err);
    core.responseJson();
  });
};

UserController.prototype.signIn = function (next) {
  userManager.signIn(function (err) {
    if (err) return next(err);
    core.responseJson();
  });
};

UserController.prototype.signOut = function (next) {
  userManager.signOut(function (err) {
    if (err) return next(err);
    core.responseJson();
  });
};

module.exports = UserController;
