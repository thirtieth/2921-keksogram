'use strict';

(function() {
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  var Gallery = function() {
    this._galleryElement = document.querySelector('.gallery-overlay');
    this._closeButton = this._galleryElement.querySelector('.gallery-overlay-close');
    this._photoElement = this._galleryElement.querySelector('.gallery-overlay-preview img');
    this._photos = [];
    this._currentPhoto = 0;

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  };

  Gallery.prototype.setPhotos = function(photos) {
    this._photos = photos;
  };

  Gallery.prototype._showCurrentPhoto = function() {
    var imageElement = this._photos[this._currentPhoto];
    this._photoElement.src = imageElement;
  };

  Gallery.prototype.setCurrentPhoto = function(photoIndex) {
    photoIndex = clamp(photoIndex, 0, this._photos.length - 1);

    if (this._currentPhoto === photoIndex) {
      return;
    }
    this._currentPhoto = photoIndex;
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
      case Key.ESC:
        this.hide();
        break;
      case Key.LEFT:
        this.setCurrentPhoto(this._currentPhoto - 1);
        break;
      case Key.RIGHT:
        this.setCurrentPhoto(this._currentPhoto + 1);
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
