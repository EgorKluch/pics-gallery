# @author EgorKluch (EgorKluch@gmail.com)
# @date: 22.09.2014

define ->
  Backbone.View.extend
    el: '#content',
    title: 'pics-gallery.ru'

    render: ->
      this.$el.html @tpl @getTplData()
      @updateTitle()

    getTplData: ->{}

    updateTitle: ->
      $('title').html @title
      $('h1.title').html @title
