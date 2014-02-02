#   @author: EgorKluch (EgorKluch@gmail.com)
#   @date: 02.02.14

'use strict'

window.app.directive 'form', ->
  return {
  restrict: 'E',
  require: ['?ngController', '?name'],

  controller: ($scope, eForm)->
    $scope.e = {form: eForm}
    $scope.l = {form: eForm.attr('name')}
    $scope.s = {form: $scope.l.form}
  }


window.app.directive 'controlGroup', ->
  return {
    restrict: 'C',
    require: ['^form']

    controller: ($scope, eControlGroup)->
      $scope.e.input = core.getFormInputsInContainer(eControlGroup)[0]
      $scope.l.input = $scope.e.input.attr('name')
      $scope.s.input = $scope.s.form[$scope.l.input]

      @checkValid = =>
        if $scope.s.form.$enabledValid and $scope.s.input.$invalid
          return eControlGroup.addClass 'error'
        eControlGroup.removeClass 'error'

    link: ($scope)->
      invalidLabel = $scope.l.form + '.' + $scope.l.input + '.$invalid'
      $scope.$watch invalidLabel, @checkValid
      $scope.$watch $scope.l.form + '.' + '$enabledValid', @checkValid
  }


window.app.directive 'helpBlock', ->
  return {
    restrict: 'C',
    require: ['^controlGroup'],

    controller: ($scope, eHelpBlock)->
      @checkError = =>
        enabledValid = $scope.s.form.$enabledValid
        return eHelpBlock.show() if enabledValid and @sErrors[@aError]
        eHelpBlock.hide()

    link: ($scope, eHelpBlock, attrs)->
      @aError = attrs.ngError
      @sErrors = $scope.s.input.$error

      errorLabel = $scope.l.form + '.' + $scope.l.input + '.$error.' + @aError
      $scope.$watch errorLabel, checkError
      $scope.$watch $scope.s.form + '.' + '$enabledValid', checkError
  }
