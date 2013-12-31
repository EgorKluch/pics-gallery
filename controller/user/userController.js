/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 31.12.13
 */

'use strict';

var util = require('util');

var Core = require('../../core/Core');
var UserManager = require('../../model/UserManager');

var core = new Core();
var userManager = new UserManager();


var UserController = function () {};

UserController.prototype.signUpPage = function () {
  var sendMethod = core.response.send.bind(core.response);
  core.getPage('user/signUp.js', 'main/main.css', 'user/signUp.twig', sendMethod);
};

UserController.prototype.signUp = function () {
  userManager.signUp(function () {
    core.response.json({result: 1});
  });
};

UserController.prototype.signIn = function () {
  userManager.signIn(function () {
    core.response.json({result: 1});
  });
};

UserController.prototype.signOut = function () {
  userManager.signOut();
  core.response.json({result: 1});
};

module.exports = UserController;
