# @author EgorKluch (EgorKluch@gmail.com)
# @date: 21.09.2014

define ['User'], ->
  App.Picture = Backbone.Model.extend
    urlRoot: '/api/picture/'

    defaults:
      id: null
      user: null
      title: ''
      description: ''
      filename: ''
      userId: null

    getLink: ->'/pictures/' + @id

    getUser: (callback)->
      return callback @user if @user and @user.get('id') is @get('userId')
      App.User.getById @get('userId'), (@user)=>callback @user

    setUser: (@user)->
      @set 'userId', @user.get 'id'

  App.Picture.add = (data, callback)->
    picture = new App.Picture data
    picture.save {},
      success: (model, response)->
        picture = new App.Picture response.picture
        callback? null, picture
      error: (model, err)->
        callback? app.parseError err

  return App.Picture
