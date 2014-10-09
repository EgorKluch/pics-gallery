# @author EgorKluch (EgorKluch@gmail.com)
# @date: 23.09.2014

define ['text!dialogTpl'], (tpl)->
  Backbone.View.extend
    el: '#dialog'

    initialize: ->
      tpl = _.template tpl
      this.$el.html tpl()
      this.$modal = $('.modal', @el)
      this.$title = $('h4.modal-title', @el)
      this.$body = $('.modal-body', @el)

    render: (title, body)->
      this.$title.html title
      this.$body.html body
      this.$modal.modal()
