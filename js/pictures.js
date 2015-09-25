(function () {

var filters = document.querySelector('.filters');

var photosContainer = document.querySelector('.pictures');
var photosTemplate = document.getElementById('picture-template');
var photosFragment = document.createDocumentFragment();

var IMAGE_FAILURE_TIMEOUT = 10000;

filters.classList.add('hidden');

pictures.forEach(function(photo, i) {

  var newPhotoElement = photosTemplate.content.children[0].cloneNode(true);

  newPhotoElement.querySelector('.picture img').src = photo['url'];
  newPhotoElement.querySelector('.picture-likes').textContent = photo['likes'];
  newPhotoElement.querySelector('.picture-comments').textContent = photo['comments'];

  photosFragment.appendChild(newPhotoElement);

  if (photo['url']) {
      var photoBackground = new Image();
      photoBackground.src = photo['url'];

      var imageLoadTimeout = setTimeout(function() {
        newPhotoElement.classList.add('picture-load-failure');
      }, IMAGE_FAILURE_TIMEOUT);

      photoBackground.onload = function() {
        //newPhotoElement.replaceChild();
        newPhotoElement.style.backgroundImage = 'url(\'' + photoBackground.src + '\')';
        newPhotoElement.style.backgroundSize = '182px 182px';
        clearTimeout(imageLoadTimeout);
      }

      photoBackground.onerror = function(evt) {
        newPhotoElement.classList.add('picture-load-failure');
      };
    }

});

photosContainer.appendChild(photosFragment);

filters.classList.remove('hidden');

})();
