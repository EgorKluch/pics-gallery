/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 20.01.14
 */

'use strict';

var fs = require('fs');
var util = require('util');
var _ = require('underscore');

var AppError = require('../core/AppError');
var BaseManager = require('../core/BaseManager');
var Picture = require('./Picture');


var PictureManager = function (core) {
  BaseManager.call(this, core, 'picture', Picture);
};

util.inherits(PictureManager, BaseManager);


PictureManager.prototype.add = function (data, next) {
  var currentUser = this.core.userManager.currentUser;

  var file = this.files['picture'];
  var filename = _.last(file.path.split('/'));
  fs.rename(file.path, __dirname + '/../public/img/pictures' + filename, function (err) {
    if (err) return next(new AppError(err));

    var picture = new this.Entity(data);
    picture.filename = filename;
    picture.addedBy = currentUser.id;

    this.mysql.insert(picture.getMysqlData(), next);
  }.bind(this));
};


module.exports = PictureManager;
