'use strict';

(function() {
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  var Gallery = function() {
    this._galleryElement = document.querySelector('.gallery-overlay');
    this._closeButton = this._galleryElement.querySelector('.gallery-overlay-close');
    this._photoElement = this._galleryElement.querySelector('.gallery-overlay-image');
    this._photos = [];
    this._currentPhoto = 0;

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  };

  Gallery.prototype.setPhotos = function(photos) {
    this._photos = photos;
  };

  Gallery.prototype._showCurrentPhoto = function() {
    this._photoElement.innerHTML = '';
    var imageElement = new Image();
    imageElement.src = this._photos[this._currentPhoto];
    imageElement.onload = function() {
      this._photoElement.appendChild(imageElement);
    }.bind(this);
  };

  Gallery.prototype.setCurrentPhoto = function(index) {
    this._currentPhoto = index;
    this._showCurrentPhoto();
  };

  Gallery.prototype.show = function() {
    this._galleryElement.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseClick);
    document.body.addEventListener('keydown', this._onDocumentKeyDown);
    this._showCurrentPhoto();
  };

  Gallery.prototype.hide = function() {
    this._galleryElement.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    document.body.removeEventListener('keydown', this._onDocumentKeyDown);
    this._photos = [];
    this._currentPhoto = 0;
  };

  Gallery.prototype._onDocumentKeyDown = function(evt) {
    switch (evt.keyCode) {
      case key.ESC:
        this.hide();
        break;
      case Key.LEFT:
        break;
      case Key.RIGHT:
        break;
      default: break;
    }
  };

  Gallery.prototype._onCloseClick = function(evt) {
    evt.preventDefault();
    this.hide();
  };

  window.Gallery = Gallery;
})();
