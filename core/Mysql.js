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

Mysql.prototype.initialize = function (callback) {
  if (this._isInit) {
    if (callback) callback();
    return;
  }
  this._isInit = true;

  this.connection = mysql.createConnection(config.mysql);
  this.connection.connect(function(err) {
    if (err) throw err;
    if (callback) callback();
  }.bind(this));
};

/**
 * Select rows from {table} who match {where}
 * In result row inludes only {columns} fields
 *
 * @param table
 * @param columns
 * @param where
 * @param callback
 */
Mysql.prototype.select = function (table, columns, where, callback) {
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
  this.query(query, callback);
};

/**
 * Return first result of this.select method result
 *
 * @param table
 * @param columns
 * @param where
 * @param callback
 */
Mysql.prototype.one = function (table, columns, where, callback) {
  this.select(table, columns, where, function (rows) {
    if (rows.length === 0) {
      callback(null);
      return;
    }
    callback(rows[0]);
  });
};

/**
 * Insert row into {table}
 *
 * @param table
 * @param fields
 * @param callback
 */
Mysql.prototype.insert = function (table, fields, callback) {
  var query = 'insert into' + mysql.escapeId(table);
  query += '(' + Object.keys(fields).forEach(function (field) {
    return mysql.escapeId(field);
  }).join(', ') + ')';
  query += ' values(' + Object.values(fields).forEach(function (value) {
    return mysql.escape(value);
  });
  this.query(query, function (response) {
    callback(response.insertId);
  });
};

/**
 * Update {table} from {values} source for rows, who match {where}
 *
 * @param table
 * @param where
 * @param values
 */
Mysql.prototype.update = function (table, where, values, callback) {
  var query = 'update ' + mysql.escapeId(table);
  query += ' set ' + this._getWhereString(values, ',');
  query += ' where ' + this._getWhereString(where);
  this.query(query, callback);
};

/**
 * Delete rows from {table} who match {where}
 *
 * @param table
 * @param where
 */
Mysql.prototype.delete = function (table, where, callback) {
  var query = 'delete from ' + mysql.escapeId(table);
  query += ' where ' + this._getWhereString(where);
  this.query(query, callback);
};

/**
 * Execute query
 * Data define source for escaping query values:
 *    https://github.com/felixge/node-mysql#escaping-query-values
 *
 * Two different call:
 *  - this.query(query, data, callback)
 *  - this.query(query, callback)
 *
 * Return result rows in {callback}
 *
 * @param query
 * @param data
 * @param callback
 */
Mysql.prototype.query = function (query, data, callback) {
  if (arguments.length === 2) {
    callback = data;
    data = [];
  }
  this.connection.query(query, data, function (err, rows) {
    if (err) throw err;
    callback(rows);
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

  if (!operator) operator = 'and';

  return _.forEach(where, function (field, value) {
    if (field === 'and' || field === 'or') {
      return ' (' + this._getWhereString(value, field)  + ')';
    }
    return mysql.escapeId(field) + '=' + mysql.escape(value);
  }.bind(this)).join(' ' + operator + ' ');
};

module.exports = Mysql;
