/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 11.01.14
 */

var BaseClass = function (core) {
  this.core = core;
  this.mysql = core.mysql;
  this.res = core.res;
  this.req = core.req;
  this.session = core.req.session;
  this.post = core.req.body;
  this.query = core.req.query;
};

module.exports = BaseClass;
