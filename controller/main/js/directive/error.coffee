# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 25.01.14

$ = require('jquery-browserify');

app.directive 'error', ->
  return {
  restrict: 'C',
  link: (s, element, attrs)->
    element = $(element).hide()

    target = attrs.ngTarget

    event = (err)->
      return element.show() if err && s.signUpForm[target].$dirty
      element.hide()

    errorField = 'signUpForm.' + target + '.$error.' + attrs.ngError
    s.$watch errorField, event
    s.$watch 'doValidate', event
  }
