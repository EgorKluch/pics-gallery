/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var Mysql = require('./Mysql');
var UserManager = require('../model/UserManager');
var PictureManager = require('../model/PictureManager');
var AppError = require('./AppError');

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
  this.res.json(code, data);
};

/**
 * @param {String} html
 * @param {Number} [code]
 */
Core.prototype.responseHtml = function (html, code) {
  code = code ? code : 200;
  this.res.send(code, html);
};

/**
 * @param {String} script
 * @param {String} style
 * @param {String} template
 * @param {Function} next
 * @param {Number} [code]
 */
Core.prototype.responseHtmlFromTemplate = function (script, style, template, next, code) {
  this.getPage(script, style, template, function (err, html) {
    if (err) return next(new AppError(err));
    this.responseHtml(html, code);
  }.bind(this));
};

Core.prototype.getTemplateData = function (script, style) {
  return {
    script: '/js/' + script + '.js',
    style: '/css/' + style + '.css',
    user: this.userManager.currentUser
  };
};

Core.prototype.getTemplate = function (template) {
  var tmp = template.split(':');
  return 'controller/' + tmp[0] + '/tpl/' + tmp[1] + '.twig';
};

/**
 * @param {String} script
 * @param {String} style
 * @param {String} template
 * @param {Function} next
 */
Core.prototype.getPage = function (script, style, template, next) {
  var data = this.getTemplateData(script, style);
  template = this.getTemplate(template);

  this.app.render(template, data, function(err, html){
    if (err) return next(new AppError(err));
    next(null, html);
  }.bind(this));
};

module.exports = Core;
