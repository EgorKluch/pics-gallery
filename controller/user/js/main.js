// Generated by CoffeeScript 1.4.0
(function() {
  'use strict';

  var app;

  app = angular.module('app', []);

  app.controller('LoginFormCtrl', [
    '$scope', '$http', function($scope, $http) {
      $scope.doValidate = false;
      $scope.signIn = function() {
        $scope.doValidate = true;
        if ($scope.loginForm.$invalid) {
          return;
        }
        return $http.post('/signIn', $scope.user).success(function(response) {
          if (!response.error) {
            return console.error(response.errorMessage);
          }
          return location.reload();
        }).error(function(response) {
          return console.error(response);
        });
      };
      return $scope.signOut = function(response) {
        if (response.error) {
          return console.error(response.error);
        }
        return location.reaload();
      };
    }
  ]);

}).call(this);
