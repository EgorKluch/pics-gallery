# @author EgorKluch (EgorKluch@gmail.com)
# @date: 21.09.2014

deps = ['pictureListTpl', 'PictureCollection', 'Mansory', 'imagesloaded']
define deps, (tpl, PictureCollection, Masonry, imagesloaded)->
  return App.ContentView.extend
    tpl: _.template tpl
    title: 'Картины'

    initialize: ({ page, size })->
      @pictures = new PictureCollection
        pageNumber: page or 1
        pageSize:   size or 100
      @pictures.on 'change', =>@render()
      @pictures.fetch()

    getTplData: ->{ pictures: @pictures.toJSON() }

    render: ->
      delete @masonry
      App.ContentView.prototype.render.call this, arguments
      container = $('.block__pictureList')[0]
      imagesloaded container, =>
        @masonry = new Masonry container, { itemSelector: 'li' }

    destroy: ->
      App.ContentView.prototype.destroy.call this, arguments
      delete @masonry
