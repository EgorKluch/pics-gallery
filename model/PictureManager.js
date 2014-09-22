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
  this._initAccessHandlers();
};

util.inherits(PictureManager, BaseManager);

PictureManager.prototype._initAccessHandlers = function () {
  var self = this;

  var initUserArgs = function (args) {
    if (!args.user) return;
    args.isOwnPicture = args.user.id === args.picture.userId;
  };

  this.accessManager.prepareHandle(function (action, args, next) {
    if (!args) args = {};

    args.user = self.core.getCurrentUser();
    if (args.user) {
      args.isSuperUser = args.user.inRoles('admin', 'moder');
    }

    if (args.user) {
      args.isPointerUser = args.user.hasRole('pointer');
    }

    if (!args.picture) return next(null, args);

    if (args.picture instanceof Picture) {
      initUserArgs(args);
      return next(null, args);
    }

    self.getById(args.picture, function (err, picture) {
      if (err) return next(err);

      args.picture = picture;
      initUserArgs(args);
      next(null, args);
    });
  });

  this.accessManager.handle('view', function (action, args, next) {
    next(null, true);
  });

  this.accessManager.handle('upload', function (handler, args, next) {
    if (!args.user) return next(null, false);
    if (!args.picture) return next(null, true);
    if (args.isOwnPicture || args.isSuperUser) return next(null, true);
    return next(null, false);
  }.bind(this));

  this.accessManager.handle('add', function (handler, args, next) {
    if (!args.user) return next(null, false);
    if (args.isPointerUser || args.isSuperUser) return next(null, true);
    return next(null, false);
  });

  this.accessManager.handle(['edit', 'delete'], function (handler, args, next) {
    if (!args.user) return next(null, false);
    if (args.isOwnPicture || args.isSuperUser) return next(null, true);
    return next(null, false);
  });
};

PictureManager.prototype._getTmpPath = function (filename) {
  return __dirname + '/../tmp/img/' + filename;
};

PictureManager.prototype._getPath = function (filename) {
  return __dirname + '/../public/img/pictures/' + filename;
};

PictureManager.prototype.upload = function (file, pictureId, next) {
  var filename = _.last(file.path.split('/'));

  fs.rename(file.path, __dirname + '/../tmp/img/' + filename, function (err) {
    if (err) return next(new AppError(err));

    var data = { filename: filename, type: 'picture' };
    if (pictureId) {
      data.picture_id = pictureId;
      this.core.mysql.one('tmp', data, function (err, tmpPicture) {
        if (err) return next(new AppError(err));
        if (tmpPicture) {
          var where = { picture_id: pictureId };
          data = { filename: filename };
          this.core.mysql.update('tmp', where, data, next);
          data = { hash: tmpPicture.id, src: this.getTmpSrc(filename) };
          next(null, data);
        }
      }.bind(this));
    }

    this.core.mysql.insert('tmp', data, function (err, id) {
      if (err) return next(new AppError(err));
      data = { hash: id, src: this.getTmpSrc(filename) };
      next(null, data);
    }.bind(this));

  }.bind(this));
};

PictureManager.prototype.getTmpSrc = function (filename) {
  return '/tmp/img/' + filename;
};

PictureManager.prototype.add = function (data, next) {
  var currentUser = this.core.userManager.currentUser;

  this.core.mysql.one('tmp', { id: data.hash }, function (err, tmpPicture) {
    if (err) return next(new AppError(err));
    if (!tmpPicture) return next(new AppError('File picture wasn\'t loaded!', 1));
    if (tmpPicture.picture_id) return next(new AppError('File picture is used yet', 2));

    var filename = tmpPicture.filename;
    var tmpPath = this._getTmpPath(filename);
    fs.rename(tmpPath, this._getPath(filename), function (err) {
      if (err) return next(new AppError(err));
      var picture = new this.Entity(data);
      picture.filename = '/img/pictures/' + filename;
      picture.addedBy = currentUser.id;
      this.core.mysql.del('tmp', { id: tmpPicture.id }, function (err) {
        if (err) return next(new AppError(err));
        this.mysql.insert(picture.getMysqlData(), next);
      }.bind(this));
    }.bind(this));
  }.bind(this));
};

PictureManager.prototype.edit = function (picture, data, next) {
  _.forEach(data, function (value, key) {
    picture[key] = value;
  });
  picture.save(next);
};

PictureManager.prototype.get = function (options, next) {
  var limit = (options.pageNumber - 1) * options.pageSize + ',' + options.pageSize;
  var query = "SELECT CONCAT('/pictures/', p.id) AS src, u.id AS userId, u.login AS userLogin, p.id, title, filename AS url FROM picture p JOIN user u ON(p.user_id=u.id) LIMIT " + limit;
  this.mysql.query(query, function (err, pictures) {
    if (err) return next(new AppError(err));
    if (options.parse) {
      pictures = pictures.map(function (picture) {
        return new this.Entity(picture, true);
      }.bind(this));
    }
    next(null, pictures);
  }.bind(this));
};

PictureManager.prototype.del = function (picture, next) {
  this.mysql.del({ id: picture.id }, function (err) {
    if (err) return next(new AppError(err));
    fs.unlink(this._getPath(picture.filename), next);
  }.bind(this));
};


module.exports = PictureManager;
