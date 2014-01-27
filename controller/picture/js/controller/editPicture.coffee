# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 26.01.14

'use strict'

app.controller 'EditPictureCtrl', ['$scope', '$http', (s, $http)->
  s.doValidate = off

  s.editPicture = ->
    s.doValidate = on
    return if s.editPictureForm.$invalid
    data = angular.extend {}, s.picture
    delete data.id
    $http.post('/picture/' + s.picture.id + '/edit', data)
      .success (response)->
        return console.error response.errorMessage if response.error
        location.href = '/picture/' + s.picture.id
      .error (response)->
          console.error response

  s.deletePicture = ->
    data = angular.extend {}, s.picture
    delete data.id
    $http.post('/picture/' + s.picture.id + '/delete', data)
      .success (response)->
          return console.error response.errorMessage if response.error
          location.href = '/'
      .error (response)->
          console.error response
]
