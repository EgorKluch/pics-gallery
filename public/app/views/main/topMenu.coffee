# @author EgorKluch (EgorKluch@gmail.com)
# @date: 21.09.2014

define ['topMenuTpl', 'User'], (tpl)->
  Backbone.View.extend
    el: '#topMenu'
    tpl: _.template tpl

    events:
      'click a[data-action="signOut"]': (e)->
        e.preventDefault()
        App.User.signOut()

    initialize: ->
      app.on 'signIn', @render.bind(this)
      app.on 'signOut', @render.bind(this)


    render: ->
      menuItems = []
      if app.user.isAnonym()
        menuItems.push { label: 'Войти', href: '/sign-in' }
        menuItems.push { label: 'Присоединиться', href: '/sign-up' }
      else
        if app.user.hasRole ['admin', 'pointer']
          menuItems.push { label: 'Добавить картину', href: '/picture/add' }
        menuItems.push { label: 'Выход', href: '#', action: 'signOut' }

      html = @tpl { menuItems }
      this.$el.html html
