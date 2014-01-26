# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 26.01.14

'use strict'

app.controller 'SignUpCtrl', ['$scope', '$http', (s, $http)->
  s.doValidate = off

  s.file = {
    url: '/picture/upload',
    fieldName: 'picture '

    change: (file)->
      return if !file? or s.addPictureForm.file.$invalid
      file.$upload(s.file.url, {})
        .success (response)->
          return console.error response.errorMessage if response.error
          s.picture.hash = response.hash
          s.picture.src = response.src
        .error (response)->
          console.error response
  }

  s.addPicture = ->
    s.doValidate = on

    console.log s.addPictureForm

    return if s.addPictureForm.$invalid or !s.picture.hash?

    data = angular.extend {}, s.picture
    delete data.src

    ###
    $http.post('/picture/add', data)
    .success (response)->
        return console.error response.errorMessage if response.error
        location.reload()
    .error (response)->
        console.error response
    ###
]
