#   @author: EgorKluch (EgorKluch@gmail.com)
#   @date: 02.02.14

'use strict'

require('../../main/js/core')
require('../../main/js/main')

BootstrapForm = require('../../main/js/BootstrapForm')

$(document).ready ->
  $signInForm = $('#signInForm')

  form = new BootstrapForm $signInForm

  enabledValidate = false
  $('input', $signInForm).keyup ->
    return if !enabledValidate
    name = $(this).attr('name')
    isValid = form[name].validateRequiredError()
    form[name].markInput isValid

  $('.btn[data-action="signIn"]', $signInForm).click ->
    try
      enabledValidate = true
      return false if !form.validateRequiredError()
      $.ajax({
        dataType: 'json'
        url: '/sign-in'
        type: 'POST'
        data: form.getData(),
        success: (response)->
          return console.error response.errorMessage if response.error
          window.location.href = '/'
        error: (response)->
          error = JSON.parse(response.responseText);
          console.error(error.errorMessage);
      })
      return false
    catch err
      console.error(err)
    return false
