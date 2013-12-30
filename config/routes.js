/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var _ = require('underscore');


module.exports = function (core) {
  var controller;
  var app = core.app;

  app.get('/', function (req, res) {
    controller = new (require('../controller/main/mainController'))();
    core.getPage(controller.index(), res.send.bind(res));
  });

  app.use(function(req, res){
    controller = new (require('../controller/main/mainController'))();
    core.getPage(controller.notFound(), function (html) {
      res.send(404, html);
    });
  });
};
