# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 25.01.14

'use strict'

window.app.controller 'SignUpCtrl', ['$scope', '$http', (s, $http)->
  s.doValidate = off

  s.checkRepeatePassword = ->
    return if s.signUpForm.repeatPassword.$pristine
    return if s.signUpForm.password.$error.required
    return if s.signUpForm.repeatPassword.$error.required

    error = s.user.repeatPassword is s.user.password
    s.signUpForm.$error.repeatPassword = error
    s.signUpForm.repeatPassword.$error.repeatPassword = error

  s.signUp = ->
    s.doValidate = on
    return if s.signUpForm.$invalid

    $http.post('/signUp', s.user)
    .success (response)->
        return console.error response.errorMessage if response.error
        window.history.back();
    .error (response)->
        console.error response
]
