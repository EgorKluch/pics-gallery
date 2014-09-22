# @author EgorKluch (EgorKluch@gmail.com)
# @date: 20.09.2014

define ['text!tpl/main/topBar.ejs', 'views/main/topMenu'], (tpl, TopMenuView)->
  Backbone.View.extend
    el: '#topBar'
    tpl: _.template tpl

    initialize: ->
      this.$el
        .addClass 'navbar'
        .addClass 'navbar-inverse'
        .addClass 'navbar-fixed-top'
      @menu = new TopMenuView()
      @render()

      app.on 'update:user', =>@updateProfileLink()

    updateProfileLink: ->
      $profileLink = $('.profileLink', @el)
      $profileLink.attr 'href', app.user.getProfileUrl()
      $profileLink.html app.user.get 'login'

    render: ->
      this.$el.html @tpl
        userLogin: app.user.get 'login'
        profileUrl: app.user.getProfileUrl()
      @menu.setElement '#topMenu'
      @menu.render()
