# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 25.01.14

$ = require('jquery-browserify');

app.directive 'error', ->
  return {
  restrict: 'C',
  link: (s, element, attrs)->
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

    event = (err)->
      console.log(target, error, err)
      return element.show() if err && (s[form][target].$dirty || s.doValidate)
      element.hide()

    errorField = form + '.' + target + '.$error.' + error
    s.$watch errorField, event
    s.$watch 'doValidate', event
  }
