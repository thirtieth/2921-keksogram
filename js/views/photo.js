/* global Backbone: true */

'use strict';

(function() {
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var photosTemplate = document.getElementById('picture-template');
  var photoImage = new Image();
  var PhotoView = Backbone.View.extend({
    initialize: function() {
      this._onImageLoad = this._onImageLoad.bind(this);
      this._onImageFail = this._onImageFail.bind(this);
      this._onClick = this._onClick.bind(this);
    },

    events: {
      'click': '_onClick'
    },

    tagName: 'img',

    className: 'picture',

    render: function() {
      this.el.appendChild(photosTemplate.content.children[0].cloneNode(true));
      this.el.querySelector('.picture-likes').textContent = this.model.get('likes');
      this.el.querySelector('.picture-comments').textContent = this.model.get('comments');

      if (this.model.get('url')) {

        photoImage.src = this.model.get('url');

        this._imageLoadTimeout = setTimeout(function() {
          this.el.classList.add('picture-load-failure');
        }.bind(this), REQUEST_FAILURE_TIMEOUT);

        photoImage.addEventListener('load', this._onImageLoad);
        photoImage.addEventListener('error', this._onImageFail);
        photoImage.addEventListener('abort', this._onImageFail);
      }
    },

    _onClick: function(evt) {
      var clickedElement = evt.target;

      if (!clickedElement.classList.contains('picture-load-failure')) {
        this.trigger('galleryclick');
      }
    },

    _onImageLoad: function(evt) {
      photoImage.style.width = '182px';
      photoImage.style.height = '182px';

      var loadedPhoto = evt.path[0];
      this._cleanupPhotoListeners(loadedPhoto);

      var oldPhoto = this.el.querySelector('.picture img');

      this.el.replaceChild(photoImage, oldPhoto);
      clearTimeout(this._imageLoadTimeout);
    },

    _onImageFail: function(evt) {
      var failedPhoto = evt.path[0];
      this._cleanupImageListeners(failedPhoto);
      this.el.classList.add('picture-load-failure');
      clearTimeout(this._imageLoadTimeout);
    },

    _cleanupPhotoListeners: function(image) {
      image.removeEventListener('load', this._onImageLoad);
      image.removeEventListener('error', this._onImageError);
      image.removeEventListener('abort', this._onImageError);
    }

  });

  window.PhotoView = PhotoView;


/*
  var Photo = function(data) {
    this._data = data;
    this._onClick = this._onClick.bind(this);
  };

  Photo.prototype.render = function(container) {
    var newPhotoElement = photosTemplate.content.children[0].cloneNode(true);

    newPhotoElement.querySelector('.picture-likes').textContent = this._data['likes'];
    newPhotoElement.querySelector('.picture-comments').textContent = this._data['comments'];

    container.appendChild(newPhotoElement);

    if (this._data['url']) {
      var photoImage = new Image();
      photoImage.src = this._data['url'];

      var imageLoadTimeout = setTimeout(function() {
        newPhotoElement.classList.add('picture-load-failure');
      }, REQUEST_FAILURE_TIMEOUT);

      photoImage.onload = function() {
        photoImage.style.width = '182px';
        photoImage.style.height = '182px';

        var oldPhoto = newPhotoElement.querySelector('.picture img');

        newPhotoElement.replaceChild(photoImage, oldPhoto);

        clearTimeout(imageLoadTimeout);
      };

      photoImage.onerror = function() {
        newPhotoElement.classList.add('picture-load-failure');
        clearTimeout(imageLoadTimeout);
      };
    }

    this._element = newPhotoElement;
    this._element.addEventListener('click', this._onClick);
  };

  Photo.prototype.dispose = function() {
    this._element.parentNode.removeChild(this._element);
    this._element.removeEventListener('click', this._onClick);
    this._element = null;
  };

  Photo.prototype._onClick = function(evt) {
    evt.preventDefault();
    if (!this._element.classList.contains('picture-load-failure')) {
      var galleryClick = new CustomEvent('galleryclick', {detail: {photoElement: this}});
      window.dispatchEvent(galleryClick);
    }
  };

  window.Photo = Photo;
  */

})();
