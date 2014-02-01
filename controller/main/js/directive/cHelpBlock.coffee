#   @author: EgorKluch (EgorKluch@gmail.com)
#   @date: 01.02.14

'use strict'

window.app.directive 'help-block', ->
  return {
  restrict: 'C',
  require: ['?for', '?error'],
  link: (scope, element, attrs)->
    error = attrs.ngError

    checkError = (err)->
      return element.show() if scope[formName].$enabledValid and err
      element.hide()

    formElement = element.parent()
    while true
      return if formElement.length is 0

      if formElement.is '.control-group'
        input = $('input', formElement)
        input = $('textarea', formElement) if input.length is 0

      if tmpElement.is 'form'
        formName = formElement.attr 'name'
        break

      formElement = formElement.parent()

    element.hide() if type is 'error' and

    errorField = form + '.' + target + '.$error.' + error

    scope.$watch errorField, checkError
    scope.$watch form + '.' + '$enabledValid', (val)->
      return if !val
      err = scope[formName][target].$error[error]
      checkError err
  }

