# @author EgorKluch (EgorKluch@gmail.com)
# @date: 20.09.2014

define ->
  App.User = Backbone.Model.extend
    urlRoot: '/api/user/'

    defaults:
      id: null
      login: 'гость'
      name: 'Гость'
      surname: null
      roles: []

    isAnonym: ->!@get 'id'
    isAuthorized: ->!@isAnonym()

    hasRole: (roles)->
      roles = [roles] if !_.isArray roles
      return !!_.intersection(roles, @get 'roles').length

    getProfileUrl: ->'/user/' + @get 'id'

  App.User.getById = (id, callback)->
    user = new App.User { id }
    user.fetch { success: callback }

  App.User.signUp = (data, callback)->
    user = new App.User data
    user.save {},
      success: (model, response)->
        app.user = new App.User response.user
        app.trigger 'signIn', { user: app.user }
        callback? null, app.user
      error: (model, err)->
        callback? app.parseError err

  App.User.signIn = (data, callback)->
    app.callApi 'user/signIn', data, (err, response)=>
      return callback? err if err
      app.user = new App.User response.user
      app.trigger 'signIn', { user: app.user }
      callback? err, app.user

  App.User.signOut = ->
    app.callApi 'user/signOut', ->
      app.user = new App.User()
      app.trigger 'signOut'

  return App.User
