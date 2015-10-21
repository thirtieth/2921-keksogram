/* global Backbone: true */

'use strict';

(function() {
  /**
   * @constructor
   * @extends {Backbone.View}
   */
  var GalleryView = Backbone.View.extend({
    events: {
      'click .gallery-overlay-image': '_onClick'
    },

    initialize: function() {
      this._onClick = this._onClick.bind(this);
    },
    /**
     * Отрисовка фото в галерее
     *
     */
    render: function() {
      this.el.querySelector('img').src = this.model.get('url');
      this.el.querySelector('.likes-count').innerText = this.model.get('likes');
      this.el.querySelector('.comments-count').innerText = this.model.get('comments');
    },
    /**
     *Добавление и удаление лайка при клике на фото галереи
     *
     */
    toggleLike: function() {
      if (this.model.get('liked')) {
        this.model.dislike();
      } else {
        this.model.like();
      }
    },
    /**
     * Обработчик клика по фото в галерее
     * @param  {MouseEvent} evt
     * @private
     */
    _onClick: function(evt) {
      evt.preventDefault();
      this.toggleLike();
      this.render();
    }

  });

  window.GalleryView = GalleryView;
})();
