# @author EgorKluch (EgorKluch@gmail.com)
# @date: 20.09.2014

define ->
  Backbone.Model.extend
    defaults:
      id: 0,
      name: 'Гость',
      roles: []

    isAnonym: ->!@get 'id'
    isAuthorized: ->!@isAnonym()

    hasRole: (roles)->
      roles = [roles] if !_.isArray roles
      return !!_.intersection(roles, @get 'roles').length
