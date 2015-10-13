'use strict';

(function() {
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var photosTemplate = document.getElementById('picture-template');

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

  Photo.prototype.unrender = function() {
    this._element.parentNode.removeChild(this._element);
    this._element.removeEventListener('click', this._onClick);
    this._element = null;
  };

  Photo.prototype._onClick = function(evt) {
    evt.preventDefault();
    if (!this._element.classList.contains('picture-load-failure')) {
      var galleryClick = new CustomEvent('galleryclick', { detail: {photoElement: this}});
      window.dispatchEvent(galleryClick);
    }
  };

  window.Photo = Photo;

})();
