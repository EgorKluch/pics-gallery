/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 30.12.13
 */

'use strict';

var crypto = require('crypto');
var util = require('util');

var BaseManager = require('../core/BaseManager');
var AppError = require('../core/AppError');
var User = require('./User');


var UserManager = function (core) {
  BaseManager.call(this, core, 'user', User);
};

util.inherits(UserManager, BaseManager);

UserManager.prototype.initialize = function (next) {
  var token = this.session.token;
  if (!token) return next();

  this.mysql.one({ token: token }, function (err, userData) {
    if (err) return next(new AppError(err));

    if (!userData) {
      this.session.token = null;
      this.currentUser = null;
      return next(null);
    }

    this.currentUser = new User(userData);
    next(null);
  }.bind(this));
};

UserManager.prototype.getUserByLogin = function (login, next) {
  this.getByField('login', login, next);
};

UserManager.prototype.getUserByEmail = function (email, next) {
  this.getByField('email', email, next);
};

UserManager.prototype.isAuthorized = function () {
  return this.currentUser;
};

UserManager.prototype.signIn = function (next) {
  if (this.isAuthorized()) {
    return next(new AppError('User already login', 1));
  }

  var password = this._getHashedPassword(this.post.password);
  var data = {
    login: this.post.login,
    password: password
  };
  this.mysql.one(data, function (err, userData) {
    if (err) return next(new AppError(err));

    if (!userData) return next(new AppError('Wrong login or password', 2));

    var id = userData.id;
    this._createToken(function (err, token) {
      if (err) return next(new AppError(err));
      this.session.token = token;
      this.mysql.update({id: id}, {token: token}, next);
    }.bind(this));
  }.bind(this));
};

UserManager.prototype.signUp = function (next) {
  if (this.isAuthorized()) return next(new AppError('User already login', 1));

  var user = new User(this.post);
  user.password = this._getHashedPassword(user.password);

  this._checkUserOnExists(user.login, user.email, function (err) {
    if (err) return next(new AppError(err));

    this._createToken(function (err, token) {
      if (err) return next(new AppError(err));

      user.token = token;

      this.mysql.insert(user.getMysqlData(), function (err) {
        if (err) return next(new AppError(err));

        this.signIn(next);
      }.bind(this));
    }.bind(this));
  }.bind(this));
};

UserManager.prototype.signOut = function (next) {
  this.session.token = null;
  next();
};

UserManager.prototype._checkUserOnExists = function (login, email, next) {
  this.getUserByLogin(login, function (err, userData) {
    if (err) return next(new AppError(err));
    if (userData) next(new AppError('User with this login already exists', 2));

    this.getUserByEmail(email, function (err, userData) {
      if (err) return next(new AppError(err));
      if (userData) return next(new AppError('User with this email already exists', 3));
      next();
    });
  }.bind(this));
};

UserManager.prototype._createToken = function (next) {
  crypto.randomBytes(16, function(err, token) {
    if (err) return next(new AppError(err));

    token = token.toString('hex');
    next(null, token);
  });
};

UserManager.prototype._getHashedPassword = function (password) {
  return crypto.createHash('md5').update(password).digest('hex');
};

module.exports = UserManager;
