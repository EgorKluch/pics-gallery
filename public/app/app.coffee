# @author EgorKluch (EgorKluch@gmail.com)
# @date: 20.09.2014

class App
  constructor: ->


$(document).ready ->
  require.config { baseUrl: 'app' }
  requirejs.onError = (err)->console.error err

  window.app = new App()
