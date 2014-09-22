# @author EgorKluch (EgorKluch@gmail.com)
# @date: 20.09.2014

define ->
  App.User = Backbone.Model.extend
    defaults:
      id: 0
      login: 'гость'
      name: 'Гость'
      surname: null
      roles: []

    isAnonym: ->!@get 'id'
    isAuthorized: ->!@isAnonym()

    hasRole: (roles)->
      roles = [roles] if !_.isArray roles
      return !!_.intersection(roles, @get 'roles').length

    getProfileUrl: ->'/user/' + @get 'id'
