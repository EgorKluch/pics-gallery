# @author EgorKluch (EgorKluch@gmail.com)
# @date: 21.09.2014

deps = ['text!tpl/picture/list.ejs', 'collections/picture', 'mansory', 'imagesloaded']
define deps, (tpl, PictureCollection, Mansory, imagesloaded)->
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
      delete @msnry
      App.ContentView.prototype.render.call this, arguments
      $container = $('.block__pictureList')
      $container.imagesLoaded =>
        console.log 'TEST'
        @masonry = $container.masonry { itemSelector: 'li' }

    destroy: ->
      App.ContentView.prototype.destroy.call this, arguments
      delete @masonry
