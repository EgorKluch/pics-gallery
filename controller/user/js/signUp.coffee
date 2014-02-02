# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 25.01.14

'use strict'

require('../../main/js/core')

$(document).ready ->
  $signUpForm = $('#signUpForm')
  $inputs = $('input', $signUpForm)

  getHelper = (name, error)->
    return model[name].helpers.filter('[data-error="' + error + '"]')

  markInput = (name, isValid)->
    container = model[name].container
    if isValid
      container.removeClass 'error'
    else
      container.addClass 'error'
    return isValid

  model = {}
  addInput = (name)->
    obj = { element: $inputs.filter('[name="' + name + '"]') }
    obj.container = core.getParentElementBySelector(obj.element, '.control-group')
    obj.helpers = $('.help-block', obj.container)
    model[name] = obj

  addInput 'login'
  addInput 'name'
  addInput 'password'
  addInput 'repeatPassword'
  addInput 'email'

  enabledValidate = false
  getHelper('repeatPassword', 'repeatPassword').hide()

  validateRequiredError = (name)->
    $element = model[name].element
    return markInput name, !$element.attr('required') or $element.val()

  validateReapeatPasswordError = ->
    $repeatPassword = model.repeatPassword.element
    $password = model.password.element
    return true if !$repeatPassword.val()
    if $password.val() isnt $repeatPassword.val()
      markInput 'repeatPassword', false
      getHelper('repeatPassword', 'repeatPassword').show()
      return false
    markInput 'repeatPassword', true
    getHelper('repeatPassword', 'repeatPassword').hide()
    return true

  $('input', $signUpForm).keyup ->
    return if !enabledValidate
    name = $(this).attr('name')
    console.log(name)
    isValid = validateRequiredError name
    if isValid and name in ['repeatPassword', 'password']
      isValid = validateReapeatPasswordError()
    markInput name, isValid

  $('.btn[data-action="signUp"]', $signUpForm).click ->
    try
      enabledValidate = true
      isValid = true
      for name of model
        isValid = validateRequiredError(name) && isValid
      isValid = validateReapeatPasswordError() && isValid
      if !isValid
        console.log('FAILED')
        return false
      console.log('SUCCESS')
      return false
    catch err
      console.error(err)
    return false
