# @author EgorKluch (EgorKluch@gmail.com)
# @date: 21.09.2014

define ['text!tpl/main/topMenu.ejs'], (tpl)->
  Backbone.View.extend
    el: '#topMenu'
    tpl: _.template tpl

    render: ->
      menuItems = []
      if app.user.isAnonym()
        menuItems.push { label: 'Войти', href: '/sign-in' }
        menuItems.push { label: 'Присоединиться', href: '/sign-up' }
      else
        if app.user.hasRole ['admin', 'pointer']
          menuItems.push { label: 'Добавить картину', href: '/picture/add' }
        menuItems.push { label: 'Выход', href: '/signOut' }

      html = @tpl { menuItems }
      this.$el.html html
