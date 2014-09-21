# @author EgorKluch (EgorKluch@gmail.com)
# @date: 20.09.2014

define ->
  Backbone.Model.extend
    defaults:
      id: 0,
      name: 'Гость',
      roles: []
