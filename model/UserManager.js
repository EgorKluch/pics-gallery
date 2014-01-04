/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 30.12.13
 */

'use strict';

var crypto = require('crypto');
var User = require('./User');
var Core = require('../core/Core');
var Mysql = require('../core/Mysql');

var core = new Core();
var mysql = new Mysql();


var UserManager = function () {
  if (UserManager.instance) return UserManager.instance;
  return UserManager.instance = this;
};

UserManager.prototype.initialize = function (callback) {
  if (this._isInit) {
    if (callback) callback();
    return;
  }
  this._isInit = true;

  var token = core.session.token;
  if (token) {
    mysql.one('user', null, { token: token }, function (userData) {
      if (!data) {
        core.session.token = null;
        this.currentUser = null;
        return;
      }
      this.currentUser = new User(userData);
      callback();
    }.bind(this));
  }
};

UserManager.prototype.getUserById = function (id, callback) {
  mysql.one('user', null, { id: id }, function (userData) {
    if (!userData) callback(null);
    callback(new User(userData));
  });
};

UserManager.prototype.getUserByLogin = function (login, callback) {
  mysql.one('user', null, { login: login }, function (userData) {
    if (!userData) callback(null);
    callback(new User(userData));
  });
};

UserManager.prototype.getUserByEmail = function (email, callback) {
  mysql.one('user', null, { email: email }, function (userData) {
    if (!userData) callback(null);
    callback(new User(userData));
  });
};

UserManager.prototype.isAuthorized = function () {
  return this.currentUser;
};

UserManager.prototype.signIn = function (callback) {
  if (this.isAuthorized()) {
    throw { errorCode: 1, message: 'User already login' };
  }

  var password = this._getHashedPassword(core.post.password);
  var data = {
    login: core.post.login,
    password: password
  };
  mysql.one('user', null, data, function (userData) {
    if (!userData) {
      throw { errorCode: 2, message: 'Wrong login or password' };
    }
    var id = userData.id;
    this._createToken(function (token) {
      core.session.token = token;
      mysql.update('user', {id: id}, {token: token}, callback);
    });
  }.bind(this));
};

UserManager.prototype.signUp = function (callback) {
  if (this.isAuthorized()) {
    throw { errorCode: 1, message: 'User already login' };
  }

  var login = core.post.login;
  var email = core.post.email;
  this.getUserByLogin(login, function (userData) {
    if (userData) {
      throw { errorCode: 2, message: 'User with this login already exists' };
    }

    this.getUserByEmail(email, function (userData) {
      if (userData) {
        throw { errorCode: 3, message: 'User with this email already exists' };
      }

      this._createToken(function (token) {
        var data = {
          login: login,
          email: email,
          token: token,
          name: core.post.name,
          password: this._getHashedPassword(core.post.password)
        };
        mysql.insert('user', data, function (id) {
          data.id = id;
          callback(new User(data));
        });
      });
    }.bind(this));
  }.bind(this));
};

UserManager.prototype.signOut = function () {
  core.session.token = null;
};

UserManager.prototype._createToken = function (callback) {
  crypto.randomBytes(32, function(err, token) {
    if (err) throw err;
    token = token.toString('hex');
    callback(token);
  });
};

UserManager.prototype._getHashedPassword = function (password) {
  return crypto.createHash('md5').update(password).digest('hex');
};

module.exports = UserManager;
