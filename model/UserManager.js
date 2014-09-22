/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 30.12.13
 */

'use strict';

var crypto = require('crypto');
var util = require('util');

var AppError = require('../core/AppError');
var BaseManager = require('../core/BaseManager');
var User = require('./User');


var UserManager = function (core) {
  BaseManager.call(this, core, 'user', User);
  this._initAccessHandlers();
};

util.inherits(UserManager, BaseManager);

UserManager.prototype._initAccessHandlers = function () {
  var self = this;
  this.accessManager.prepareHandle(function (action, args, next) {
    if (!args) args = {};
    args.currentUser = self.core.getCurrentUser();
    if (args.user) {
      args.isSuperUser = args.currentUser.inRoles('admin', 'moder');
    }
    if (!args.user) args.user = args.currentUser;
    next(null, args);
  });

  this.accessManager.handle(['signIn', 'signUp'], function (action, args, next) {
    next(null, !args.currentUser);
  });

  this.accessManager.handle('signOut', function (action, args, next) {
    next(null, args.currentUser);
  });

  this.accessManager.handle(['edit', 'delete'], function (action, args, next) {
    if (!args.currentUser) return next(null, false);
    if (args.isSuperUser || args.currentUser.id === args.user.id) {
      return next(null, true);
    }
    return next(null, false);
  });
};

UserManager.prototype.initialize = function (next) {
  var self = this;

  var token = this.session.token;
  if (!token) return next();

  this.mysql.one({ token: token }, function (err, userData) {
    if (err) return next(new AppError(err));

    if (!userData) {
      self.session.token = null;
      self.currentUser = null;
      return next(null);
    }

    self.currentUser = new self.Entity(userData);
    next(null);
  });
};

UserManager.prototype.getByLogin = function (login, next) {
  this.getByField('login', login, next);
};

UserManager.prototype.getByEmail = function (email, next) {
  this.getByField('email', email, next);
};

UserManager.prototype.isAuthorized = function () {
  return !!this.currentUser;
};

UserManager.prototype.signIn = function (login, password, next) {
  var self = this;
  password = this._getHashedPassword(password);
  var data = {
    login: login,
    password: password
  };
  this.mysql.one(data, function (err, userData) {
    if (err) return next(new AppError(err));
    if (!userData) return next(new AppError('Wrong login or password', 1));

    var id = userData.id;
    self._createToken(function (err, token) {
      if (err) return next(new AppError(err));
      self.session.token = token;
      self.mysql.update({ id: id }, { token: token }, function (err, data) {
        if (err) return next(new AppError(err));
        var user = new self.Entity(userData);
        next(null, user);
      });
    });
  });
};

UserManager.prototype.signUp = function (data, next) {
  var self = this;
  var user = new this.Entity(data);
  user.password = this._getHashedPassword(user.password);

  this._checkUserOnExists(user.login, user.email, function (err) {
    if (err) return next(new AppError(err));
    self._createToken(function (err, token) {
      if (err) return next(new AppError(err));

      user.token = token;
      self.mysql.insert(user.getMysqlData(), function (err) {
        if (err) return next(new AppError(err));
        self.signIn(user.login, data.password, next);
      });
    });
  });
};

UserManager.prototype.signOut = function (next) {
  this.session.token = null;
  next();
};

UserManager.prototype._checkUserOnExists = function (login, email, next) {
  var self = this;
  this.getByLogin(login, function (err, userData) {
    if (err) return next(new AppError(err));
    if (userData) next(new AppError('User with this login already exists', 2));

    self.getByEmail(email, function (err, userData) {
      if (err) return next(new AppError(err));
      if (userData) return next(new AppError('User with this email already exists', 3));
      next();
    });
  });
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
