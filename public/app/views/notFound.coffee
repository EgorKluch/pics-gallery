# @author EgorKluch (EgorKluch@gmail.com)
# @date: 21.09.2014

define ['text!tpl/notFound.ejs'], (tpl)->
  App.ContentView.extend
    tpl: _.template tpl

    initialize: ->@render()