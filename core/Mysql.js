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


var Mysql = function () {
  if (Mysql.instance) return Mysql.instance;
  return Mysql.instance = this;
};

Mysql.prototype.initialize = function (next) {
  if (this._isInit) return next()
  this._isInit = true;

  this.connection = mysql.createConnection(config.mysql);
  this.connection.connect(next);
};

/**
 * Select rows from {table} who match {where}
 * In result row inludes only {columns} fields
 *
 * @param table
 * @param columns
 * @param where
 * @param next
 */
Mysql.prototype.select = function (table, columns, where, next) {
  table = mysql.escapeId(table);
  if (where) {
    where = ' where ' + this._getWhereString(where, 'and');
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
 * @param table
 * @param columns
 * @param where
 * @param next
 */
Mysql.prototype.one = function (table, columns, where, next) {
  this.select(table, columns, where, function (err, rows) {
    if (rows.length === 0) {
      next(err, null);
      return;
    }
    next(err, rows[0]);
  });
};

/**
 * Insert row into {table}
 *
 * @param table
 * @param fields
 * @param next
 */
Mysql.prototype.insert = function (table, fields, next) {
  var query = 'insert into' + mysql.escapeId(table);
  query += '(' + Object.keys(fields).forEach(function (field) {
    return mysql.escapeId(field);
  }).join(', ') + ')';
  query += ' values(' + Object.values(fields).forEach(function (value) {
    return mysql.escape(value);
  });
  this.query(query, function (err, response) {
    if (err) return next(err);
    next(null, response.insertId);
  });
};

/**
 * Update {table} from {values} source for rows, who match {where}
 *
 * @param table
 * @param where
 * @param values
 * @param next
 */
Mysql.prototype.update = function (table, where, values, next) {
  var query = 'update ' + mysql.escapeId(table);
  query += ' set ' + this._getWhereString(values, ',');
  query += ' where ' + this._getWhereString(where, 'and');
  this.query(query, next);
};

/**
 * Delete rows from {table} who match {where}
 *
 * @param table
 * @param where
 * @param next
 */
Mysql.prototype.remove = function (table, where, next) {
  var query = 'delete from ' + mysql.escapeId(table);
  query += ' where ' + this._getWhereString(where, 'and');
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
 * @param query
 * @param data
 * @param next
 */
Mysql.prototype.query = function (query, data, next) {
  if (arguments.length === 2) {
    next = data;
    data = null;
  }
  this.connection.query(query, data, function (err, rows) {
    if (err) return next(err);
    next(null, rows);
  });
};

/**
 * Build where string from where object
 * Example: { a:1, b:2, or: { c: 3, and: { d:4, e:5 } } } transform to
 *    a=1 and b=2 and (c=3 or (d=4 and e=5))
 *
 * @param where
 * @param operator
 * @returns {*}
 * @private
 */
Mysql.prototype._getWhereString = function (where, operator) {
  if (where === null) return '';
  if (_.isString(where)) return where;

  return _.map(where, function (value, field) {
    if (field === 'and' || field === 'or') {
      return ' (' + this._getWhereString(value, field)  + ')';
    }
    return mysql.escapeId(field) + '=' + mysql.escape(value);
  }.bind(this)).join(' ' + operator + ' ');
};

module.exports = Mysql;
