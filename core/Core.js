/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var _ = require('underscore');

var AppError        = require('./AppError');
var MainController = require('../controller/main/mainController');
var Mysql           = require('./Mysql');
var PictureManager  = require('../model/PictureManager');
var UserManager     = require('../model/UserManager');

var mainController = new MainController();

/**
 * @param app
 * @param req
 * @param res
 * @constructor
 */
var Core = function (app, req, res) {
  this.app = app;
  this.req = req;
  this.res = res;
  this.session = req.session;
  this.post = req.body;
  this.query = req.query;
  this.params = req.params;
  this.files = req.files;

  this.mysql = new Mysql(this);
};

/**
 * @param {Function} [next]
 */
Core.prototype.initialize = function (next) {

  this.mysql.initialize(function (err) {
    if (err) return next(new AppError(err));

    this.userManager = new UserManager(this);
    this.pictureManager = new PictureManager(this);

    this.userManager.initialize(function (err) {
      if (err) return next(new AppError(err));
      next();
    });

  }.bind(this));
};

/**
 * @param {Object} [data]
 * @param {Number} [code]
 */
Core.prototype.responseJson = function (data, code) {
  code = code ? code : 200;
  data = data ? data : {};
  data.result = 1;
  this.res.status(code).json(data);
  this.mysql.destroy();
};

/**
 * @param {String} html
 * @param {Number} [code]
 */
Core.prototype.responseHtml = function (html, code) {
  code = code ? code : 200;
  this.res.send(code, html);
  this.mysql.destroy();
};

Core.prototype.getCurrentUser = function () {
  return this.userManager.currentUser;
};

/**
 * @param {Object} data
 * @param {String} template
 * @param {Function} next
 * @param {Number} [code]
 */
Core.prototype.responseHtmlFromTemplate = function (template, data, next, code) {
  this.render(template, data, function (err, html) {
    if (err) return next(new AppError(err));
    this.responseHtml(html, code);
  }.bind(this));
};

Core.prototype.notFound = function (next) {
  mainController.notFound(this, next);
};

Core.prototype.forbidden = function (next) {
  mainController.forbidden(this, next);
};

Core.prototype.jsonForbidden = function () {
  this.responseJson({
    result: 0,
    errorCode: 0,
    errorMessage: 'Forbidden'
  }, 403);
};

Core.prototype.render = function (template, data, next) {
  var tmp = template.split(':');
  template = 'controller/' + tmp[0] + '/tpl/' + tmp[1] + '.jade';

  if (!data.scripts) {
    data.scripts = [data.script];
    delete data.script;
  }

  if (!data.styles) {
    data.styles = [data.style];
    delete data.style;
  }

  data.scripts = data.scripts.map(function (script) {
    return '/js/' + script + '.js';
  });

  data.styles = data.styles.map(function (style) {
    return '/css/' + style + '.css';
  });

  if (undefined === data.existsLeftBar) data.existsLeftBar = false;
  data.user = this.userManager.currentUser;

  this.app.render(template, data, function(err, html){
    if (err) return next(new AppError(err));
    next(null, html);
  }.bind(this));
};

Core.prototype.callAsyncMethods = function (objects, method, next) {
  if (objects.length === 0) return next();
  var object = objects[0];

  method.call(object, function (err) {
    if (err) return next(new AppError(err));

    this.callAsyncMethods(_.toArray(objects).slice(1), method, next);
  }.bind(this));
};

module.exports = Core;
