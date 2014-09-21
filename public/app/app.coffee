# @author EgorKluch (EgorKluch@gmail.com)
# @date: 20.09.2014

class App
  constructor: ->
    require ['views/topBar', 'Router', 'text'], (TopBarView, Router)=>
      @_initUser =>
        @topBar = new TopBarView()
        @content = null # Еще не инициализировали

        @router = new Router()
        Backbone.history.start { pushState: true }

  _initUser: (callback)->
    require ['models/user'], (User)=>
      @user = new User
        id: 2,
        name: 'Егор',
        roles: ['admin', 'user']
      callback?();


$(document).ready ->
  require.config { baseUrl: 'app' }
  requirejs.onError = (err)->console.error err
  requirejs.config
    paths:
      text: '../lib/require.text'

  window.app = new App()
