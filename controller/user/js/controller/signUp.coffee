# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 25.01.14

'use strict'

app.controller 'SignUpCtrl', ['$scope', '$http', (s, $http)->
  s.doValidate = off

  s.checkRepeatePassword = ->
    return if s.signUpForm.repeatPassword.$pristine
    return if s.signUpForm.password.$error.required
    return if s.signUpForm.repeatePassword.$error.required

    error = s.user.repeatPassword is s.user.password
    s.signUpForm.$error.repeatPassword = error
    s.signUpForm.repeatePassword.$error.repeatPassword = error

  s.signUp = ->
    s.doValidate = on
    return if s.signUpForm.$invalid

    $http.post('/signUp', s.user)
    .success (response)->
        return console.error response.errorMessage if response.error
        location.reload()
    .error (response)->
        console.error response
]
