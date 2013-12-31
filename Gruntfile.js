/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function (grunt) {
  var config = {
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      files: ['js/**/*'],
      tasks: ['build'],
      options: {
        atBegin: true,
        spawn: false
      }
    },

    jshint: {
      options: {
        globals: {
          '$': true,
          'ko': true,
          'Common': true,
          'keynav': true,
          'EPG': true,
          oipfObjectFactory: true
        },
        node: true,
        browser: true,
        strict: true,
        eqeqeq: true,
        eqnull: true,
        forin: true,
        immed: true,
        indent: 2,
        latedef: true,
        newcap: true,
        quotmark: 'single',
        undef: true,
        trailing: true,
        boss: true,
        laxbreak: true
      },
      allFiles: [
        'Gruntfile.js',
        'app.js',
        'controller/**/*.js',
        'core/**/*.js'
      ]
    }
  };

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', 'Build controllers', function () {
    var browserify = {};
    var copy = {};
    var controllerPath = 'controller/';

    var scanScripts = function (controller, callback) {
      var controllerName = path.basename(controller);
      fs.readdir(controller + '/src/', function (err, scripts){
        if (err) throw err;
        scripts
          .map(function (script) { return path.join(controller + '/src/', script); })
          .filter(function (script) { return fs.statSync(script).isFile(); })
          .forEach(function(script) {
            var scriptName = path.basename(script);
            browserify[controllerName] = {
              src: script,
              dest: 'js/' + controllerName + '/' + scriptName,
              options: {
                transform: ['brfs'],
                debug: true
              }
            };
          });
        callback();
      });
    };

    var scanStyles = function (controllers, callback) {
      if (controllers.length === 0) {
        callback();
        return;
      }
      var controller = controllers.shift();
      var controllerName = path.basename(controller);
      scanScripts(controller, function () {
        copy[controllerName] = {
          expand: true,
          cwd: 'controller/' + controllerName + '/css/',
          src: '**.css',
          dest: 'css/' + controllerName + '/'
        };
        scanControllers(controllers, callback);
      });
    };

    var done = this.async();
    fs.readdir(controllerPath, function (err, dirs) {
      if (err) throw err;
      var controllers = dirs
        .map(function (dir) {return path.join(controllerPath, dir); })
        .filter(function (dir) { return fs.statSync(dir).isDirectory(); });
      scanStyles(controllers, function () {

        grunt.config.set('clean', ['build/js', 'build/css']);
        grunt.task.run('clean');

        grunt.config.set('browserify', browserify);
        grunt.task.run('browserify');

        grunt.config.set('copy', copy);
        grunt.task.run('copy');

        done(0);
      });
    });
  });
};
