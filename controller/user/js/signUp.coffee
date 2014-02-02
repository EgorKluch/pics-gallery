# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 25.01.14

'use strict'

require('../../main/js/core')

BootstrapForm = require('../../main/BootstrapForm')

$(document).ready ->
  $signUpForm = $('#signUpForm')

  form = new BootstrapForm $signUpForm
  form.repeatPassword.switchHelper 'repeatPassword', false

  validateReapeatPasswordError = ->
    repeatPassword = form.repeatPassword
    password = form.password
    return true if !repeatPassword.val()
    if password.val() isnt repeatPassword.val()
      repeatPassword.markInput false
      return !repeatPassword.switchHelper 'repeatPassword', true
    repeatPassword.markInput true
    return !repeatPassword.switchHelper 'repeatPassword', false

  enabledValidate = false
  $('input', $signUpForm).keyup ->
    return if !enabledValidate
    name = $(this).attr('name')
    isValid = form[name].validateRequiredError()
    if isValid and name in ['repeatPassword', 'password']
      isValid = validateReapeatPasswordError()
    form[name].markInput isValid

  $('.btn[data-action="signUp"]', $signUpForm).click ->
    try
      enabledValidate = true
      isValid = form.validateRequiredError()
      isValid = validateReapeatPasswordError() && isValid
      return false if !isValid
      $.ajax({
        dataType: 'json'
        url: '/sign-up'
        type: 'POST'
        data: form.getData(),
        success: (response)->
          return console.error response.errorMessage if response.error
          window.history.back()
        error: (response)->
          error = JSON.parse(response.responseText);
          console.error(error.errorMessage);
      })
      return false
    catch err
      console.error(err)
    return false

