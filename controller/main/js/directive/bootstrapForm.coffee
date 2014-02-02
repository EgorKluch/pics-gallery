#   @author: EgorKluch (EgorKluch@gmail.com)
#   @date: 02.02.14

'use strict'

window.app.directive 'formHorizontal', ->
  return {
  restrict: 'C',
  require: ['?ngController', '?name'],

  controller: ($scope, $element)->
    $scope.e = {form: $element}
    $scope.l = {form: $element.attr('name')}
    $scope.s = {form: $scope.l.form}
  }


window.app.directive 'controlGroup', ->
  return {
    restrict: 'C',
    require: ['^formHorizontal']

    controller: ($scope, $element)->
      console.log($scope)
      $scope.e.input = core.getFormInputsInContainer($element)[0]
      $scope.l.input = $scope.e.input.attr('name')
      $scope.s.input = $scope.s.form[$scope.l.input]

      @checkValid = =>
        if $scope.s.form.$enabledValid and $scope.s.input.$invalid
          return $element.addClass 'error'
        $element.removeClass 'error'

    link: ($scope)->
      invalidLabel = $scope.l.form + '.' + $scope.l.input + '.$invalid'
      $scope.$watch invalidLabel, @checkValid
      $scope.$watch $scope.l.form + '.' + '$enabledValid', @checkValid
  }


window.app.directive 'helpBlock', ->
  return {
    restrict: 'C',
    require: ['^controlGroup'],

    controller: ($scope, $element)->
      @checkError = =>
        enabledValid = $scope.s.form.$enabledValid
        return $element.show() if enabledValid and @sErrors[@aError]
        $element.hide()

    link: ($scope, eHelpBlock, attrs)->
      @aError = attrs.ngError
      @sErrors = $scope.s.input.$error

      errorLabel = $scope.l.form + '.' + $scope.l.input + '.$error.' + @aError
      $scope.$watch errorLabel, @checkError
      $scope.$watch $scope.s.form + '.' + '$enabledValid', @checkError
  }
