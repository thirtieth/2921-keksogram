/* global GalleryView: true Backbone: true */

'use strict';

(function() {
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  var Gallery = function() {
    this._photosCollection = new Backbone.Collection();

    this._galleryElement = document.querySelector('.gallery-overlay');
    this._closeButton = this._galleryElement.querySelector('.gallery-overlay-close');
    this._currentPhoto;

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  };

  Gallery.prototype.setPhotos = function(photos) {
    this._photosCollection = photos;
  };

  Gallery.prototype.showPhoto = function(photoModel) {
    this._index = this._photosCollection.indexOf(photoModel);

    this._currentPhoto = photoModel;
    var galleryElement = new GalleryView({model: this._currentPhoto});

    galleryElement.render();
  };

  Gallery.prototype.show = function() {
    this._galleryElement.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseClick);
    document.body.addEventListener('keydown', this._onDocumentKeyDown);
  };

  Gallery.prototype.hide = function() {
    this._galleryElement.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    document.body.removeEventListener('keydown', this._onDocumentKeyDown);
    this._photosCollection.reset();
  };

  Gallery.prototype._onDocumentKeyDown = function(evt) {
    switch (evt.keyCode) {
      case Key.ESC:
        this.hide();
        break;
      case Key.LEFT:
        this.showPhoto(this._photosCollection.at(this._index - 1));
        break;
      case Key.RIGHT:
        this.showPhoto(this._photosCollection.at(this._index + 1));
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
