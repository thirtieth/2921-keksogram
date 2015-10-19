/* global Backbone: true */

'use strict';

(function() {
  var photoElement = document.querySelector('.gallery-overlay-preview img');

  var GalleryView = Backbone.View.extend({
    events: {
      'click': '_onClick'
    },

    initialize: function() {
      this._onClick = this._onClick.bind(this);
    },

    render: function() {
      photoElement.src = this.model.get('url');
    },

    _onClick: function(evt) {
      evt.preventDefault();
      console.log('like');
    }

  });

  window.GalleryView = GalleryView;
})();
