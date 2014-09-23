# @author EgorKluch (EgorKluch@gmail.com)
# @date: 20.09.2014

Backbone.emulateJSON = true;

class window.App
  constructor: ->
    require ['views/main/topBar', 'views/main/dialog', 'Router', 'text'], (TopBarView, DialogView, Router)=>
      @_initUser =>
        @topBar = new TopBarView()
        @dialog = new DialogView()
        @content = null # Еще не инициализировали

        @router = new Router()
        Backbone.history.start { pushState: true }

        $('body').on 'click', 'a', (e)->
          return if location.host isnt @host
          e.preventDefault()
          app.navigate @pathname

  navigate: (url)->
    @router.navigate url, { trigger: true }

  callApi: (method, args, callback)->
    if _.isFunction args
      callback = args
      args = {}
    jQuery.ajax
      url: '/api/' + method
      data: args
      type: 'POST'
      dataType: 'json'
      success: (response)->callback null, response
      error: (err)=>
        callback @parseError err

  parseError: (err)->
    err = err.responseText
    try
      err = JSON.parse err
      err = err.errorMessage
    return err

  _initUser: (callback)->
    require ['User'], =>
      app.callApi 'user/current', (err, response)=>
        if (err)
          console.error err
          @user = new App.User()
        else
          @user = new App.User response.user
        @trigger 'update:user'
        callback?()

_.extend(App.prototype, Backbone.Events);

$(document).ready ->
  require.config { baseUrl: '/app' }
  requirejs.onError = (err)->console.error err
  requirejs.config
    paths:
      text:         '../lib/require.text'
      imagesloaded: '../lib/imagesloaded.pkgd.min'
      Mansory:      '../lib/masonry.pkgd.min'
      User:         './models/user'
      Picture:      './models/picture'


  require ['views/main/content', 'views/main/contentForm'], (ContentView, ContentFormView)->
    App.ContentView = ContentView
    App.ContentFormView = ContentFormView
    window.app = new App()
