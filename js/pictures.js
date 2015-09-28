'use strict';

(function() {
  var filters = document.querySelector('.filters');

  var photosContainer = document.querySelector('.pictures');
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var photos;

  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  filters.classList.add('hidden');

  function renderPhotos(photoItem) {
    photosContainer.classList.remove('pictures-failure');
    photosContainer.innerHTML = '';

    var photosTemplate = document.getElementById('picture-template');
    var photosFragment = document.createDocumentFragment();

    photoItem.forEach(function(photo) {

      var newPhotoElement = photosTemplate.content.children[0].cloneNode(true);

      newPhotoElement.querySelector('.picture-likes').textContent = photo['likes'];
      newPhotoElement.querySelector('.picture-comments').textContent = photo['comments'];

      photosFragment.appendChild(newPhotoElement);

      if (photo['url']) {
        var photoImage = new Image();
        photoImage.src = photo['url'];

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
    });

    photosContainer.appendChild(photosFragment);
  }

  function showLoadFailure() {
    photosContainer.classList.add('pictures-failure');
  }

  function loadData(url, onComplete, onError, onProgress) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open('get', url);
    xhr.send();

    xhr.onreadystatechange = function(evt) {
      var loadedXhr = evt.target;

      switch (loadedXhr.readyState) {
        case ReadyState.OPENED:
        case ReadyState.HEADERS_RECEIVED:
        case ReadyState.LOADING:
          onProgress();
          break;

        case ReadyState.DONE:
        default:
          if (loadedXhr.status === 200) {
            var data = loadedXhr.response;
            onComplete(JSON.parse(data));
          }

          if (loadedXhr.status > 400) {
            onError();
          }
          break;
      }
    };

    xhr.ontimeout = function() {
      onError();
    };
  }

  function loadPhotos(callback) {
    loadData(
      'data/pictures.json',
      function(json) {
        photosContainer.classList.remove('pictures-loading');
        callback(json);
      },
      showLoadFailure,
      function() {
        photosContainer.classList.add('pictures-loading');
      }
    );
  }

  function comparePhotosByDate(aPhoto, bPhoto) {
    return Date.parse(bPhoto.date) - Date.parse(aPhoto.date);
  }

  function comparePhotosByPopularity(aPhoto, bPhoto) {
    return bPhoto.comments - aPhoto.comments;
  }

  function filterPhotos(images, filterValue) {
    var filteredPhotos = images.slice(0);
    switch (filterValue) {
      case 'discussed':
        filteredPhotos = filteredPhotos.sort(comparePhotosByPopularity);
        break;

      case 'new':
        filteredPhotos = filteredPhotos.sort(comparePhotosByDate);
        break;

      default:
        filteredPhotos = images.slice(0);
        break;
    }

    return filteredPhotos;
  }

  function setActiveFilter(filterValue) {
    var filteredPhotos = filterPhotos(photos, filterValue);
    renderPhotos(filteredPhotos);
  }

  function initFilters() {
    var filterElements = document.querySelectorAll('.filters-radio');
    for (var i = 0, l = filterElements.length; i < l; i++) {
      filterElements[i].onclick = function(evt) {
        var clickedFilter = evt.currentTarget;
        setActiveFilter(clickedFilter.value);

        clickedFilter.checked = true;
      };
    }
  }

  initFilters();
  loadPhotos(function(loadedPhotos) {
    photos = loadedPhotos;
    setActiveFilter('popular');
  });

  filters.classList.remove('hidden');

})();
