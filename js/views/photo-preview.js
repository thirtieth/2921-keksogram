/* global Backbone: true */

'use strict';

(function() {
  var GalleryPhoto = Backbone.View.extend({
    tagName: 'img',

    render: function() {
      this.el.src = this.model.get('url');
    }
  });

  window.GalleryPhoto = GalleryPhoto;
})();
