/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 11.01.14
 */

'use strict';


var BaseClass = function (core) {
  this.core = core;
  this.mysql = core.mysql;
  this.res = core.res;
  this.req = core.req;
  this.session = core.session;
  this.post = core.body;
  this.query = core.query;
  this.files = core.files;
};

module.exports = BaseClass;
