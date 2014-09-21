# @author EgorKluch (EgorKluch@gmail.com)
# @date: 20.09.2014

define ['text!tpl/topBar.ejs'], (topBarTpl)->
  Backbone.View.extend
    el: '#topBar'
    tpl: _.template(topBarTpl)

    initialize: ->
      this.$el
        .addClass 'navbar'
        .addClass 'navbar-inverse'
        .addClass 'navbar-fixed-top'
      @render()

    render: ->
      this.$el.html @tpl {
        userName: app.user.get 'name'
        profileUrl: '/user/' + app.user.get('id')
      }
