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

UserController.prototype.signUpPage = function (req, res) {
  core.getPage('user/signUp.js', 'main/main.css', 'user/signUp.twig', function (html) {
    res.send(html);
  });
};

UserController.prototype.signUp = function (req, res) {
  userManager.signUp(function () {
    res.json({result: 1});
  });
};

UserController.prototype.signIn = function (req, res) {
  userManager.signIn(function () {
    res.json({result: 1});
  });
};

UserController.prototype.signOut = function (req, res) {
  userManager.signOut();
  res.json({result: 1});
};

module.exports = UserController;
