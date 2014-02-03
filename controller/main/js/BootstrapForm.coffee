#   @author: EgorKluch (EgorKluch@gmail.com)
#   @date: 02.02.14

'use strict';

BootstrapInput = require('./BootstrapInput')

BootstrapForm = (form)->
  @_addInput input for input in $('input', form)
  @_addInput input for input in $('textarea', form)
  return this

BootstrapForm.prototype._addInput = (input)->
  $input = $(input)
  name = $input.attr('name')
  return this[name] = $input if $input.attr('type') is 'hidden'
  this[name] = new BootstrapInput $input

BootstrapForm.prototype.getData = ->
  data = {}
  for name, input of this
    data[name] = input.val() if input instanceof BootstrapInput
  return data

BootstrapForm.prototype.validateRequiredError = ->
  isValid = true
  for name, input of this
    if input instanceof BootstrapInput
      isValid = input.validateRequiredError() && isValid
  return isValid

module.exports = BootstrapForm;
