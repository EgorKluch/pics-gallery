# @author EgorKluch (EgorKluch@gmail.com)
# @date: 20.09.2014

define ->
  Backbone.Router.extend
    routes:
      '': ->@_initContentView 'index'
      'sign-in': ->app.user.trigger 'signIn'
      'sign-out': ->app.user.trigger 'signOut'
      'sign-up': ->@_initContentView 'signUp'
      'picture/:id/add': (id)->@_initContentView 'addPicture', { id }
      'picture/:id/edit': (id)->@_initContentView 'editPicture', { id }
      '*notFound': ->@_initContentView 'notFound'

    _initContentView: (view, options, callback)->
      # Init arguments
      options = {} if !options
      if _.isFunction options
        callback = options
        options = {}

      require ['views/' + view], (View)->
        app.content.destroy() if app.content
        options.el = '#content'
        app.content = new View options
        app.content.render()
        callback?()
