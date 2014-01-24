# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 31.12.13

'use strict'

$ = require('jquery-browserify');

app = angular.module('app', []);

app.controller('LoginFormCtrl', ['$scope', ($scope)->
  $scope.signIn = ->

  isInvalid = (field)->
    input = $scope.loginForm[field]
    !input.$pristine and input.$invalid

  $scope.isInvalidLogin = ->isInvalid 'login'
  $scope.isInvalidPassword = ->isInvalid 'password'
]);
