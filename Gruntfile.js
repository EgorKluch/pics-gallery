/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var fs = require('fs');
var path = require("path");

module.exports = function (grunt) {
  var config = {
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      controllers: {
        files: [
          {
            expand: true,
            cwd: 'controllers',
            src: '*/css/*.css',
            dest: 'build/'
          }
        ]
      }
    },

    clean: ['build/**'],

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
        'scripts/**/*.js'
      ]
    }
  };

  config.browserify = {
    index: {
      src: 'controllers/*/js/main.js',
        dest: 'build/test.js',
        options: {
        transform: ['brfs'],
          debug: true
      }
    }
  };

  config.browserify = {};
  var controllerPath = './controllers';
  fs.readdir(controllerPath, function (err, dirs) {
    if (err) throw err;

    dirs
      .map(function (dir) { return path.join(p, dir); })
      .filter(function (dir) { return fs.statSync(dir).isDirectory(); })
      .forEach(function (dir) {
        var controllerName =_.last(dir.dirname.split('/'));
        fs.readdir(dir + '/js/', function (err, scripts){

        })
      });
  });

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
};
