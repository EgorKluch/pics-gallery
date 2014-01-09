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

UserController.prototype.signUpPage = function (req, res, next) {
  core.getPage('user/signUp.js', 'main/main.css', 'user/signUp.twig', function (err, html) {
    if (err) return next(err);
    res.send(html);
  });
};

UserController.prototype.signUp = function (req, res, next) {
  userManager.signUp(function (err) {
    if (err) return next(err);
    res.json({result: 1});
  });
};

UserController.prototype.signIn = function (req, res, next) {
  userManager.signIn(function (err) {
    if (err) return next(err);
    res.json({result: 1});
  });
};

UserController.prototype.signOut = function (req, res, next) {
  userManager.signOut(function (err) {
    if (err) return next(err);
    res.json({result: 1});
  });
};

module.exports = UserController;
