# @author EgorKluch (EgorKluch@gmail.com)
# @date: 21.09.2014

define ['Picture'], ->
  Backbone.Collection.extend
    model: App.Picture
    url: '/api/pictures'
    syncProcess: false
    changed: false

    initialize: (models, { @pageNumber, @pageSize })->
      @.on 'request', =>@syncProcess = true
      @.on 'sync', =>
        @.trigger 'change'  if @changed
        @syncProcess = false
        @changed = false
      @.on 'add remove reset', =>
        if @syncProcess
          @changed = true
        else
          @.trigger 'change'

    fetch: ->
      Backbone.Collection.prototype.fetch.call this,
        data: { @pageNumber, @pageSize }
