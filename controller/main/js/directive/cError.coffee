# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 25.01.14

'use strict'

window.app.directive 'error', ->
  return {
  restrict: 'C',
  require: '?ngTarget',
  link: (scope, element, attrs)->
    element = $(element).hide()

    target = attrs.ngTarget
    error = attrs.ngError

    formElement = element.parent()
    while true
      return if formElement.length is 0
      if formElement.is 'form'
        form = formElement.attr 'name'
        break
      formElement = formElement.parent()

    errorField = form + '.' + target + '.$error.' + error

    checkError = (err)->
      return element.show() if err and (scope[form][target].$dirty or scope.doValidate)
      element.hide()

    scope.$watch errorField, checkError
    scope.$watch 'doValidate', ()->
      err = scope[form][target].$error[error]
      checkError err
  }
