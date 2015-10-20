/* global Backbone: true */

'use strict';

(function() {
  var GalleryView = Backbone.View.extend({
    events: {
      'click': '_onClick'
    },

    initialize: function() {
      this._onClick = this._onClick.bind(this);
      this._onModelLike = this._onModelLike.bind(this);
      this.model.on('change:liked', this._onModelLike);
    },

    render: function(photoImg) {
      photoImg.src = this.model.get('url');
    },

    _onClick: function(evt) {
      evt.preventDefault();
      if (evt.target.classList.contains('gallery-overlay-preview')) {
        if (this.model.get('liked')) {
          this.model.dislike();
        } else {
          this.model.like();
        }
      }
    },

    _onModelLike: function() {
      console.log('like');
    }

  });

  window.GalleryView = GalleryView;
})();
