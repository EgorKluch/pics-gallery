# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 24.01.14

'use strict'

window.app.controller 'SignInCtrl', ['$scope', '$http', ($scope, $http)->
  $scope.doValidate = off

  $scope.signIn = ->
    $scope.doValidate = on
    return if $scope.loginForm.$invalid

    $http.post('/signIn', $scope.user)
      .success (response)->
        return console.error response.errorMessage if response.error
        location.reload()
      .error (response)->
        console.error response

  $scope.signOut = (response)->
    $http.post('/signOut', $scope.user)
      .success (response)->
          return console.error response.errorMessage if response.error
          location.href = '/'
      .error (response)->
          console.error response
]
