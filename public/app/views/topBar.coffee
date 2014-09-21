# @author EgorKluch (EgorKluch@gmail.com)
# @date: 20.09.2014

define ['text!tpl/topBar.ejs', 'views/topMenu'], (tpl, TopMenuView)->
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

    render: ->
      this.$el.html @tpl
        userLogin: app.user.get 'login'
        profileUrl: '/user/' + app.user.get 'id'
      @menu.setElement '#topMenu'
      @menu.render()
