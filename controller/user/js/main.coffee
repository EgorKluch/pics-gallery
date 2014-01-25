# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 31.12.13

'use strict'

app = angular.module 'app', []

app.controller 'LoginFormCtrl', ['$scope', '$http', ($scope, $http)->
  $scope.doValidate = off

  $scope.signIn = ->
    $scope.doValidate = on
    return if $scope.loginForm.$invalid

    $http.post('/signIn', $scope.user)
      .success (response)->
        return console.error response.errorMessage if !response.error
        location.reload()
      .error (response)->
        console.error response

  $scope.signOut = (response)->
    return console.error response.error if response.error
    location.reaload()
]
