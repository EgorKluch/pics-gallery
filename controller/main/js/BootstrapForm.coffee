#   @author: EgorKluch (EgorKluch@gmail.com)
#   @date: 02.02.14

'use strict';

BootstrapInput = (@element)->
  @container = core.getParentElementBySelector(@element, '.control-group')
  @helpers = $('.help-block', @container)
  @name = @element.attr 'name'
  return this


BootstrapInput.prototype.getHelper = (error)->
  return @helpers.filter('[data-error="' + error + '"]')

BootstrapInput.prototype.switchHelper = (error, show)->
  helper = @getHelper error
  return helper.show() if show
  helper.hide()
  return show

BootstrapInput.prototype.markInput = (isValid)->
  if isValid
    @container.removeClass 'error'
  else
    @container.addClass 'error'
  return isValid

BootstrapInput.prototype.val = ->
  @element.val()

BootstrapInput.prototype.validateRequiredError = ->
  isValid = !@element.attr('required') or @val()
  return @markInput isValid


BootstrapForm = (form)->
  @_addInput input for input in $('input', form)
  @_addInput input for input in $('textarea', form)
  return this

BootstrapForm.prototype._addInput = (input)->
  $input = $(input)
  name = $input.attr('name')
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
