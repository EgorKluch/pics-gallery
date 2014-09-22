# @author EgorKluch (EgorKluch@gmail.com)
# @date: 20.09.2014

define ->
  Backbone.Router.extend
    routes:
      '': ->                      @_initContentView 'main/frontpage'
      'sign-in': ->               @_initContentView 'user/signIn'
      'sign-up': ->               @_initContentView 'user/signUp'
      'picture/add': (id)->       @_initContentView 'picture/addPicture', { id }
      'picture/:id/edit': (id)->  @_initContentView 'picture/editPicture', { id }

      'pictures(/page/:page)(/size/:size)': (page, size)->
        @_initContentView 'picture/pictureList', { page, size }

      '*notFound': ->             @_initContentView 'main/notFound'

    _initContentView: (view, options, callback)->
      # Init arguments
      options = {} if !options
      if _.isFunction options
        callback = options
        options = {}

      require ['views/' + view], (View)->
        app.content.destroy?() if app.content
        options.el = '#content'
        app.content = new View options
        callback?()
