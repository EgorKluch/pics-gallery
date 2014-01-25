# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 25.01.14

app = angular.module 'app', ['oi.file']

app.controller 'TestFileUploaCtrl', ['$scope', (s)->
  s.options = {
    change: (file)->
      file.$upload('/fileUpload', { title: 'Мона Лиза' })
  }
]
