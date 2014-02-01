#   @author: EgorKluch (EgorKluch@gmail.com)
#   @date: 01.02.14

'use strict'

window.app.directive 'control-group', ->
  return {
  restrict: 'C',
  link: (scope, element)->

    formElement = element.parent()
    while true
      return if formElement.length is 0
      if formElement.is 'form'
        formName = formElement.attr 'name'
        break
      formElement = formElement.parent()

    input = $('input', element)
    input = $('textarea', element) if input.length is 0
    field = input.attr('name')

    checkValid = ()->
      form = scope[formName]
      isInvalid = form[field].$invalid
      return element.addClass('error') if form.$enabledValid and isInvalid
      element.removeClass('error')

    invalidField = formName + '.' + field + '.$invalid'

    scope.$watch invalidField, checkValid
    scope.$watch formName + '.' + '$enabledValid', checkValid
  }
