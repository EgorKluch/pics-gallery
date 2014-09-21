/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var express = require('express');
var AppError = require('../core/AppError');

module.exports = function (app) {
  app.use(function (req, res, next) {
    if (0 === req.path.indexOf('/api/')) return next();
    res.sendfile('public/index.html');
  });
};
