/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      index: {
        src: ['scripts/pages/index.js'],
        dest: 'js/index.js',
        options: {
          transform: ['brfs'],
          debug: true
        }
      }
    },

    copy: {
      pages: {
        files: [
          {
            expand: true,
            cwd: 'scripts/pages/',
            src: '**',
            dest: 'js/'
          }
        ]
      }
    },

    clean: {
      vod: ['js/**/*']
    },

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
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', ['clean', 'copy', 'browserify']);
};
