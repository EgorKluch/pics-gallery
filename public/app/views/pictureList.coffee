# @author EgorKluch (EgorKluch@gmail.com)
# @date: 21.09.2014

define ['text!tpl/pictureList.ejs', 'collections/picture'], (tpl, PictureCollection)->
  return App.ContentView.extend
    tpl: _.template tpl
    title: 'Картины'

    initialize: ({ page, size })->
      @pictures = new PictureCollection
        pageNumber: page or 1
        pageSize:   size or 10
      @pictures.on 'change', =>@render()
      @pictures.fetch()

    render: ->
      this.$el.html @tpl
        pictures: @pictures.toJSON()
      @updateTitle()
