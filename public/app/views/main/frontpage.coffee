# @author EgorKluch (EgorKluch@gmail.com)
# @date: 21.09.2014

define ->
  App.ContentView.extend
    initialize: ->
      app.navigate '/pictures'
