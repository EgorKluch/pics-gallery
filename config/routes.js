/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

var _ = require('underscore');

var render = function (app, template, script, style, data, callback) {
  if (_.isFunction(data)) {
    callback = data;
    data = {};
  }
  data.script = '/js/' + template;
  data.style = '/css/' + style;
  app.render(template, data, function (err, html) {
    if (err) throw err;
    callback(html);
  });
};

module.exports = function (core) {
  var app = core.app;
  app.get('/', function (req, res) {
    return core.getController('main/index');
  });

  app.use(function(req, res){
    render(app, 'notFound.twig', 'index.js', 'main.css', function (html) {
      res.send(404, html);
    });
  });
};
