#   @author: EgorKluch (EgorKluch@gmail.com)
#   @date: 03.02.14

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

module.exports = BootstrapInput
