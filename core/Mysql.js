/**
 * Proxy class to node-mysql
 * Provides some convenient methods for simple queries
 *
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var mysql = require('mysql');
var _ = require('underscore');
var config = require('../config/config');

var AppError = require('./AppError');


/**
 * @constructor
 */
var Mysql = function () {
  if (Mysql.instance) return Mysql.instance;
  return Mysql.instance = this;
};

/**
 * @param {Function} next
 */
Mysql.prototype.initialize = function (next) {
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
  table = mysql.escapeId(table);
  if (where) {
    where = ' where ' + this._getWhereString(where);
  }

  if (columns === null) {
    columns = '*';
  } else {
    columns = columns.forEach(function (column) {
      return mysql.escapeId(column);
    }).join(', ');
  }

  var query = 'select ' + columns + ' from ' + table + where;
  this.query(query, next);
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
  this.select(table, columns, where, function (err, rows) {
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
Mysql.prototype.remove = function (table, where, next) {
  var query = 'delete from ' + mysql.escapeId(table);
  query += ' where ' + this._getWhereString(where);
  this.query(query, next);
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

module.exports = Mysql;
