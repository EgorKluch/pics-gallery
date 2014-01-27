# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 26.01.14

'use strict'

app.controller 'AddPictureCtrl', ['$scope', '$http', (s, $http)->
  s.doValidate = off

  s.file = {
    url: '/picture/upload',
    fieldName: 'picture'

    change: (file)->
      return if !file?
      file.$upload(s.file.url, {}).then(
        (response)->
          response = response.data
          return console.error response.errorMessage if response.error
          s.picture.hash = response.hash
          s.picture.src = response.src
        (response)->
          response = response.data
          console.error response
      )
  }

  s.addPicture = ->
    s.doValidate = on

    return if s.addPictureForm.$invalid or s.picture.hash isnt undefined

    data = angular.extend {}, s.picture
    delete data.src
    delete data.file

    $http.post('/picture/add', data)
    .success (response)->
        return console.error response.errorMessage if response.error
        location.reload()
    .error (response)->
        console.error response
]
