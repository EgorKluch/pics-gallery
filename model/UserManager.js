/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 30.12.13
 */

'use strict';

var crypto = require('crypto');
var util = require('util');

var BaseClass = require('../core/BaseClass');
var AppError = require('../core/AppError');
var User = require('./User');


var UserManager = function (core) {
  BaseClass.call(this, core);
};

util.inherits(UserManager, BaseClass);

UserManager.prototype.initialize = function (next) {
  var token = this.session.token;
  if (!token) return next();

  this.mysql.one('user', null, { token: token }, function (err, userData) {
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

UserManager.prototype.getUserById = function (id, next) {
  this.mysql.one('user', null, { id: id }, function (err, userData) {
    if (err) return next(new AppError(err));
    if (!userData) return next(null, null);
    next(null, new User(userData));
  });
};

UserManager.prototype.getUserByLogin = function (login, next) {
  this.mysql.one('user', null, { login: login }, function (err, userData) {
    if (err) return next(new AppError(err));
    if (!userData) return next(null, null);
    return next(null, new User(userData));
  });
};

UserManager.prototype.getUserByEmail = function (email, next) {
  this.mysql.one('user', null, { email: email }, function (err, userData) {
    if (err) return next(new AppError(err));
    if (!userData) return next(null);
    next(null, new User(userData));
  });
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
  this.mysql.one('user', null, data, function (err, userData) {
    if (err) return next(new AppError(err));

    if (!userData) return next(new AppError('Wrong login or password', 2));

    var id = userData.id;
    this._createToken(function (err, token) {
      if (err) return next(new AppError(err));
      this.session.token = token;
      this.mysql.update('user', {id: id}, {token: token}, next);
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

      this.mysql.insert('user', user.getMysqlData(), function (err) {
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
