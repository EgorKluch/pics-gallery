#   @author: EgorKluch (EgorKluch@gmail.com)
#   @date: 02.02.14

'use strict'

window.app.directive 'formHorizontal', ->
  return {
    restrict: 'C'
    require: ['?ngController', '?name'],
    scope: true

    compile: ->
      return {
        pre: ($scope, $element)->
          $scope.e = {form: $element}
          $scope.l = {form: $element.attr('name')}
          $scope.s = {form: $scope[$scope.l.form]}
      }
  }


window.app.directive 'controlGroup', ->
  return {
    restrict: 'C'

    compile: ->
      return {
        pre: ($scope, $element)->
          $scope.e.input = core.getFormInputsInContainer($element)[0]
          $scope.l.input = $scope.e.input.attr('name')
          $scope.s.input = $scope.s.form[$scope.l.input]
          $scope.l.errors = $scope.s.input.$error
      }

    link: ($scope, $element)->
      return if !core.getParentElementBySelector $element, '.form-horizontal'

      checkValid = =>
        if $scope.s.form.$enabledValid and $scope.s.input.$invalid
          return $element.addClass 'error'
        $element.removeClass 'error'

      invalidLabel = $scope.l.form + '.' + $scope.l.input + '.$invalid'
      $scope.$watch invalidLabel, checkValid
      $scope.$watch $scope.l.form + '.' + '$enabledValid', checkValid
  }


window.app.directive 'helpBlock', ->
  return {
    restrict: 'C'

    compile: ->
      return {
        pre: ($scope, $element, attrs)->
          $scope.a = {error: attrs.ngError}
      }

    link: ($scope, $element, attrs)->
      return if !core.getParentElementBySelector $element, '.control-group'
      checkError = =>
        enabledValid = $scope.s.form.$enabledValid
        return $element.show() if enabledValid and $scope.s.errors[$scope.a.error]
        $element.hide()

      errorLabel = $scope.l.form + '.' + $scope.l.input + '.$error.' + $scope.a.error
      $scope.$watch errorLabel, checkError
      $scope.$watch $scope.s.form + '.' + '$enabledValid', checkError
  }
