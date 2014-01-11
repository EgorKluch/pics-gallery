/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 30.12.13
 */

'use strict';

var crypto = require('crypto');
var User = require('./User');
var Core = require('../core/Core');
var Mysql = require('../core/Mysql');
var AppError = require('../core/AppError');

var core = new Core();
var mysql = new Mysql();


var UserManager = function () {
  if (UserManager.instance) return UserManager.instance;
  return UserManager.instance = this;
};

UserManager.prototype.initialize = function (next) {
  if (this._isInit) next();
  this._isInit = true;

  var token = core.session.token;
  if (token) {
    mysql.one('user', null, { token: token }, function (err, userData) {
      if (err) return next(err);

      if (!data) {
        core.session.token = null;
        this.currentUser = null;
        return next();
      }

      this.currentUser = new User(userData);
      next();
    }.bind(this));
  }
};

UserManager.prototype.getUserById = function (id, next) {
  mysql.one('user', null, { id: id }, function (err, userData) {
    if (err) return next(err);
    if (!userData) return next(null, null);
    next(null, new User(userData));
  });
};

UserManager.prototype.getUserByLogin = function (login, next) {
  mysql.one('user', null, { login: login }, function (err, userData) {
    if (err) return next(err);
    if (!userData) return next(null, null);
    return next(null, new User(userData));
  });
};

UserManager.prototype.getUserByEmail = function (email, next) {
  mysql.one('user', null, { email: email }, function (err, userData) {
    if (err) return next(err);
    if (!userData) next(null);
    next(new User(userData));
  });
};

UserManager.prototype.isAuthorized = function () {
  return this.currentUser;
};

UserManager.prototype.signIn = function (next) {
  if (this.isAuthorized()) {
    return next(new AppError('User already login', 1));
  }

  var password = this._getHashedPassword(core.post.password);
  var data = {
    login: core.post.login,
    password: password
  };
  mysql.one('user', null, data, function (err, userData) {
    if (err) return next(err);

    if (!userData) return next(new AppError('Wrong login or password', 2));

    var id = userData.id;
    this._createToken(function (err, token) {
      if (err) return next(err);
      core.session.token = token;
      mysql.update('user', {id: id}, {token: token}, next);
    });
  }.bind(this));
};

UserManager.prototype.signUp = function (next) {
  if (this.isAuthorized()) return next(new AppError('User already login', 1));

  var login = core.post.login;
  var email = core.post.email;
  this._checkUserOnExists(login, email, function (err) {
    if (err) return next(err);

    this._createToken(function (err, token) {
      if (err) return next(err);

      var data = {
        login: login,
        email: email,
        token: token,
        name: core.post.name,
        password: this._getHashedPassword(core.post.password)
      };

      mysql.insert('user', data, function (err, id) {
        if (err) return next(err);

        data.id = id;
        next();
      });
    });
  }.bind(this));
};

UserManager.prototype.signOut = function (next) {
  core.session.token = null;
  next();
};


UserManager.prototype._checkUserOnExists = function (login, email, next) {
  this.getUserByLogin(login, function (err, userData) {
    if (err) return next(err);
    if (userData) next(new AppError('User with this login already exists', 2));

    this.getUserByEmail(email, function (err, userData) {
      if (err) return next(err);
      if (userData) return next(new AppError('User with this email already exists', 3));
      next();
    });
  }.bind(this));
};

UserManager.prototype._createToken = function (next) {
  crypto.randomBytes(32, function(err, token) {
    if (err) return next(err);

    token = token.toString('hex');
    next(null, token);
  });
};

UserManager.prototype._getHashedPassword = function (password) {
  return crypto.createHash('md5').update(password).digest('hex');
};

module.exports = UserManager;
