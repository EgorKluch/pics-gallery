# @author EgorKluch (EgorKluch@gmail.com)
# @date: 21.09.2014

define ['notFoundTpl'], (tpl)->
  App.ContentView.extend
    tpl: _.template tpl
    title: 'Страница не найдена'

    initialize: ->@render()
