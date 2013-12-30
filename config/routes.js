/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var _ = require('underscore');
var Core = require('../core/Core');

var core = new Core();
var app = core.app;

var createController = function (path) {
  var Controller = require('../controller/' + path);
  return new Controller();
};


app.get('/', function (req, res) {
  var controller = this.createController('main/mainController');
  core.getPage(controller.index(), res.send.bind(res));
});

app.use(function(req, res){
  var controller = this.createController('main/mainController');
  core.getPage(controller.notFound(), function (html) {
    res.send(404, html);
  });
});
