/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

var express = require('express');
var app = express();

var config = require('./config/config');

var mysql = require('mysql');
var connection = mysql.createConnection(config.mysql);
connection.connect(function(err) {
  //if (err) throw err;
  console.log('Mysql is connected!');
});

app.configure(function(){
  app.set('views', __dirname + '/templates');
  app.set('view engine', 'twig');

  // This section is optional and can be used to configure twig.
  app.set('twig options', {
    strict_variables: true
  });
});

app.get('/', function (req, res) {
  connection.query('SELECT 1', function (err, rows) {
    console.log(rows);
    res.render('index', {
      message : "Hello World"
    });
  });
});

app.listen(3000);
console.log('Express started on port 3000');
