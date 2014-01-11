/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var Mysql = require('./Mysql');
var AppError = require('./AppError');

var mysql = new Mysql();


/**
 * @param app
 * @constructor
 */
var Core = function (app) {
  if (Core.instance) return Core.instance;

  this.app = app;

  return Core.instance = this;
};

/**
 * @param {Function} [callback]
 */
Core.prototype.initialize = function (callback) {
  if (this._isInit) {
    if (callback) callback();
    return;
  }
  this._isInit = true;
  mysql.initialize(callback);
};

/**
 * @param req
 * @param res
 * @param {function} next
 */
Core.prototype.initData = function (req, res, next) {
  this.request = req;
  this.response = res;
  this.session = this.request.session;
  this.post = this.request.body;
  next();
};

/**
 * @param {String} method
 * @param {String} url
 * @param {String} path
 * @returns {Core}
 */
Core.prototype.addRoute = function (method, url, path) {
  if (method === null || ['get', 'post', 'delete', 'use'].indexOf(method) === -1) {
    return this.error(new Error('Undefined route method'));
  }

  var pathParts = path.split(':');

  var Controller = require('../controller/' + pathParts[0]);
  var controller = new Controller();

  var controllerMethod = pathParts[1];
  controllerMethod = controller[controllerMethod].bind(controller);

  this.app[method](url, this.initData.bind(this), function () {
    controllerMethod(this.error.bind(this));
  }.bind(this));

  return this;
};

/**
 * @param {Error||AppError} [err]
 */
Core.prototype.error = function (err) {
  if (!err) return;

  if (!(err instanceof AppError)) {
    err = new AppError(err);
  }

  console.log('\n\n');
  console.error(err.stack);
  console.log('\n\n');

  this.response.json(err.status, err.getData());
};

/**
 * @param {Object} [data]
 * @param {Number} [code]
 */
Core.prototype.responseJson = function (data, code) {
  code = code ? code : 200;
  data = data ? data : {};
  data.result = 1;
  this.response.json(code, data);
};

/**
 * @param {String} html
 * @param {Number} [code]
 */
Core.prototype.responseHtml = function (html, code) {
  code = code ? code : 200;
  this.response.send(code, html);
};

/**
 * @param {String} script
 * @param {String} style
 * @param {String} template
 * @param {Number} [code]
 */
Core.prototype.responseHtmlFromTemplate = function (script, style, template, code) {
  this.getPage(script, style, template, function (err, html) {
    if (err) return this.error(err);
    this.responseHtml(html, code);
  }.bind(this));
};

/**
 * @param {String} script
 * @param {String} style
 * @param {String} template
 * @param {Function} next
 */
Core.prototype.getPage = function (script, style, template, next) {
  var data = {
    script: '/js/' + script,
    style: '/css/' + style
  };
  template = 'controller/' + template;
  this.app.render(template, data, function(err, html){
    if (err) return next(err);
    next(err, html);
  });
};

module.exports = Core;
