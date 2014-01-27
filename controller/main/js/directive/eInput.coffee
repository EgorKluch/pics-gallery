# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 26.01.14

'use strict'

window.app.directive 'input', ['$parse', ($parse)->
  return {
    restrict: 'E',
    require: '?ngModel',
    link: (scope, element, attrs)->
      if attrs.ngModel and attrs.value
        $parse(attrs.ngModel).assign scope, attrs.value
  }
]
