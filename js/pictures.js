'use strict';

(function () {

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

  function renderPhotos(photos) {

    photosContainer.classList.remove('pictures-failure');
    photosContainer.innerHTML = '';

    var photosTemplate = document.getElementById('picture-template');
    var photosFragment = document.createDocumentFragment();

    photos.forEach(function(photo) {

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

        photoImage.onerror = function(evt) {
          newPhotoElement.classList.add('picture-load-failure');
          clearTimeout(imageLoadTimeout);
        };
      }
    });

    photosContainer.appendChild(photosFragment);
  }

  function loadPhotos(callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open('get', 'data/pictures.json');
    xhr.send();

    xhr.onreadystatechange = function(evt) {
      var loadedXhr = evt.target;

      switch (loadedXhr.readyState) {
        case ReadyState.OPENED:
        case ReadyState.HEADERS_RECEIVED:
        case ReadyState.LOADING:
          photosContainer.classList.add('pictures-loading');
          break;

        case ReadyState.DONE:
        default:
          if (loadedXhr.status == 200) {
            var data = loadedXhr.response;
            photosContainer.classList.remove('pictures-loading');
            callback(JSON.parse(data));
          }

          if (loadedXhr.status > 400) {
            showLoadFailure();
          }
          break;
      }
    };

    xhr.ontimeout = function() {
      showLoadFailure();
    }
  }

  function showLoadFailure() {
    photosContainer.classList.add('pictures-failure');
  }

  function initFilters() {
    var filterElements = document.querySelectorAll('.filters-radio');
    for (var i = 0, l = filterElements.length; i < l; i++) {
      filterElements[i].onclick = function(evt) {
        var clickedFilter = evt.currentTarget;
        setActiveFilter(clickedFilter.value);

        clickedFilter.checked = true;
      }
    }
  }

  function filterPhotos(photos, filterValue) {
    var filteredPhotos = photos.slice(0);
    switch (filterValue) {
      case 'discussed':
        filteredPhotos = filteredPhotos.sort(function(a, b) {
          if (a.comments > b.comments || (b.comments && a.comments === 0)) {
            return -1;
          }

          if (a.comments < b.comments || (a.comments && b.comments === 0)) {
            return 1;
          }

          if (a.comments === b.comments) {
            return 0;
          }
        });

        break;

      case 'new':
        filteredPhotos = filteredPhotos.sort(function(a, b) {
          if (a.date > b.date) {
            return -1;
          }

          if (a.date < b.date) {
            return 1;
          }

          if (a.date === b.date) {
            return 0;
          }
        });

        break;

      default:
        filteredPhotos = photos.slice(0);
        break;
    }

    return filteredPhotos;
  }

  function setActiveFilter(filterValue) {
    var filteredPhotos = filterPhotos(photos, filterValue);
    renderPhotos(filteredPhotos);
  }

  filters.classList.remove('hidden');

  initFilters();
  loadPhotos(function(loadedPhotos) {
    photos = loadedPhotos;
    setActiveFilter('popular');
  });

})();
