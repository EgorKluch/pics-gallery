# @author EgorKluch (EgorKluch@gmail.com)
# @date: 20.09.2014

Backbone.emulateJSON = true;

class window.App
  constructor: ->
    require ['views/main/topBar', 'Router', 'text'], (TopBarView, Router)=>
      @_initUser =>
        @topBar = new TopBarView()
        @content = null # Еще не инициализировали

        @router = new Router()
        Backbone.history.start { pushState: true }

        $('body').on 'click', 'a', (e)->
          return if location.host isnt @host
          e.preventDefault()
          app.navigate @pathname

        @on 'signOut', =>
          @callApi 'user/signOut', =>
            @user = new App.User()
            @trigger 'update:user'
            @navigate '/'

        @on 'signIn', ({ user })=>
          @user = new App.User user
          @trigger 'update:user'

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
      error: (xhr)->
        response = xhr.responseText
        try
          response = JSON.parse response
          response = response.errorMessage
        callback response

  _initUser: (callback)->
    require ['models/user'], =>
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
      mansory:      '../lib/masonry.pkgd.min'
      imagesloaded: '../lib/imagesloaded.pkgd.min'


  require ['views/main/content', 'views/main/contentForm'], (ContentView, ContentFormView)->
    App.ContentView = ContentView
    App.ContentFormView = ContentFormView
    window.app = new App()
