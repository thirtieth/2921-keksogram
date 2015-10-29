/* global Backbone: true */

'use strict';

define([
  'models/photo'
], function() {
  var VideoView = Backbone.View.extend({
    events: {
      'click .gallery-overlay-image': '_onClick'
    },

    initialize: function() {
      this._onClick = this._onClick.bind(this);
    },

    render: function() {
      var videoElement = document.createElement('video');
      this.el.appendChild(videoElement);
    },

    _onClick: function(evt) {
      evt.preventDefault();

    }

  });

  return VideoView;
});
