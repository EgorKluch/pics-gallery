/**
 * Proxy class to node-mysql
 * Provides some convenient methods for simple queries
 *
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var util   = require('util');
var mysql  = require('mysql');
var _      = require('underscore');

var config  = require('../config/config');

var AppError  = require('./AppError');

/**
 * @constructor
 */
var Mysql = function () {};

/**
 * @param {Function} next
 */
Mysql.prototype.initialize = function (next) {
  this.cache = {};
  this.connection = mysql.createConnection(config.mysql);
  this.connection.connect(next);
};

/**
 * Select rows from {table} who match {where}
 * In result row inludes only {columns} fields
 *
 * @param {String} table
 * @param {Array|String} columns
 * @param {String|Array|Object} where
 * @param {Function} next
 */
Mysql.prototype.select = function (table, columns, where, next) {
  if (arguments.length === 3) {
    next = where;
    where = columns;
    columns = null;
  }
  this._select(table, columns, where, next);
};

Mysql.prototype.selectAll = function (table, columns, next) {
  if (arguments.length === 2) {
    next = columns;
    columns = null;
  }
  this._select(table, columns, null, next);
};

/**
 * Return first result of this.select method result
 *
 * @param {String} table
 * @param {Array} columns
 * @param {String|Array|Object} where
 * @param {Function} next
 */
Mysql.prototype.one = function (table, columns, where, next) {
  if (arguments.length === 3) {
    next = where;
    where = columns;
    columns = null;
  }
  this._select(table, columns, where, function (err, rows) {
    if (err) return next(new AppError(err));
    if (rows.length === 0) return next(null, null);
    next(null, rows[0]);
  });
};

/**
 * Insert row into {table}
 *
 * @param {String} table
 * @param {Object} fields
 * @param {Function} next
 */
Mysql.prototype.insert = function (table, fields, next) {
  var query = 'insert into' + mysql.escapeId(table);

  query += '(' + _.map(fields, function (value, field) {
    if (!_.isString(field)) throw new AppError('Field must be a string');
    return mysql.escapeId(field);
  }).join(', ') + ')';

  query += ' values(' + _.map(fields, function (value) {
    return mysql.escape(value);
  }).join(', ') + ')';

  this.query(query, function (err, response) {
    if (err) return next(new AppError(err));
    next(null, response.insertId);
  });
};

Mysql.prototype.resetCache = function () {
  this.cache = {};
};

/**
 * Update {table} from {values} source for rows, who match {where}
 *
 * @param {String} table
 * @param {String|Array|Object} where
 * @param {Object} values
 * @param {Function} next
 */
Mysql.prototype.update = function (table, where, values, next) {
  var query = 'update ' + mysql.escapeId(table);
  query += ' set ' + this._getWhereString(values, ',');
  query += ' where ' + this._getWhereString(where);
  this.query(query, next);
};

/**
 * Delete rows from {table} who match {where}
 *
 * @param {String} table
 * @param {String|Array|Object} where
 * @param {Function} next
 */
Mysql.prototype.del = function (table, where, next) {
  var query = 'delete from ' + mysql.escapeId(table);
  query += ' where ' + this._getWhereString(where);
  this.query(query, next);
};

Mysql.prototype._select = function (table, columns, where, next) {
  table = mysql.escapeId(table);
  if (where) {
    where = ' where ' + this._getWhereString(where);
  } else {
    where = '';
  }


  if (columns === null) {
    columns = '*';
  } else {
    columns = columns.forEach(function (column) {
      return mysql.escapeId(column);
    }).join(', ');
  }

  var query = 'select ' + columns + ' from ' + table + where;

  if (this.cache[query]) {
    return next(null, this.cache[query]);
  }
  else {
    this.query(query, function (err, rows) {
      if (err) return new AppError(err);
      this.cache[query] = rows;
      next(null, rows);
    }.bind(this));
  }
};


/**
 * Execute query
 * Data define source for escaping query values:
 *    https://github.com/felixge/node-mysql#escaping-query-values
 *
 * Two different call:
 *  - this.query(query, data, next)
 *  - this.query(query, next)
 *
 * Return result rows in {next}
 *
 * @param {String} query
 * @param {Object|Function} data
 * @param {Function} [next]
 */
Mysql.prototype.query = function (query, data, next) {
  if (arguments.length === 2) {
    next = data;
    data = null;
  }

  console.log(query);
  this.connection.query(query, data, function (err, rows) {
    if (err) return next(new AppError(err));
    next(null, rows);
  });
};

/**
 * Build where string from where object
 * Example: { a:1, b:2, or: { c: 3, and: { d:4, e:5 } } } transform to
 *    a=1 and b=2 and (c=3 or (d=4 and e=5))
 *
 * @param {String|Array|Object} where
 * @param {String} [operator='and']
 * @returns {String}
 * @private
 */
Mysql.prototype._getWhereString = function (where, operator) {
  if (!where) return '';
  if (_.isString(where)) return where;

  if (!operator) operator = 'and';

  return _.map(where, function (value, field) {
    if (field === 'and' || field === 'or') {
      return ' (' + this._getWhereString(value, field)  + ')';
    }
    return mysql.escapeId(field) + '=' + mysql.escape(value);
  }.bind(this)).join(' ' + operator + ' ');
};


var AssignMysql = function (mysql, table) {
  this.connection = mysql.connection;
  this.cache = mysql.cache;
  this.select = Mysql.prototype.select.bind(this, table);
  this.one = Mysql.prototype.one.bind(this, table);
  this.insert = Mysql.prototype.insert.bind(this, table);
  this.update = Mysql.prototype.update.bind(this, table);
  this.del = Mysql.prototype.del.bind(this, table);
  this.selectAll = Mysql.prototype.selectAll.bind(this, table);
};

util.inherits(AssignMysql, Mysql);


Mysql.prototype.assign = function (table) {
  return new AssignMysql(this, table);
};

Mysql.prototype.destroy = function () {
  console.log('Mysql destroy');
  this.connection.end();
};


module.exports = Mysql;
