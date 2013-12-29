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

module.exports = function (app) {
  app.get('/', function (req, res) {
    render(app, 'index.twig', 'index.js', 'main.css', function (html) {
      res.send(html);
    });
  });

  app.use(function(req, res){
    render(app, 'notFound.twig', 'index.js', 'main.css', function (html) {
      res.send(404, html);
    });
  });
};
