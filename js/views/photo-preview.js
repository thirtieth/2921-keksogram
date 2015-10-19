/* global Backbone: true */

'use strict';

(function() {
  var GalleryView = Backbone.View.extend({
    tagName: 'img',

    events: {
      'click': '_onLikeClick',
    },

    initialize: function() {
      this._onModelLike = this._onModelLike.bind(this);
      this.model.on('change:liked', this._onModelLike);
    },

   _onLikeClick: function(evt) {
      if (evt.target.classList.contains('gallery-overlay-preview')) {
        if (this.model.get('liked')) {
          this.model.dislike();
          console.log('dislike');
        } else {
          this.model.like();
          console.log('like');
        }
      }
    },

    _onModelLike: function() {
      this._updateLike();
    },

    _updateLike: function() {

    },

    render: function() {
      console.log('render here');

    }

  });

  window.GalleryView = GalleryView;
})();
