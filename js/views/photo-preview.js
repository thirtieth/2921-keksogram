/* global Backbone: true */

'use strict';

(function() {
  var GalleryView = Backbone.View.extend({
    events: {
      'click': '_onClick'
    },

    initialize: function() {
      this._onClick = this._onClick.bind(this);
    },

    render: function(photoImg) {
      photoImg.src = this.model.get('url');
    },

    _onClick: function(evt) {
      evt.preventDefault();
      console.log('like');
    }

  });

  window.GalleryView = GalleryView;
})();
