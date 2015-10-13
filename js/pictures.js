/* global Photo: true Gallery: true */

'use strict';

(function() {
  var filters = document.querySelector('.filters');

  var photosContainer = document.querySelector('.pictures');
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var PAGE_SIZE = 12;
  var photos;
  var currentPage = 0;
  var currentPhotos;
  var gallery;
  var photoUrl;

  var filterForm = document.forms['filters-set'];
  var filterPopular = filterForm['filter-popular'];
  var filterNew = filterForm['filter-new'];
  var filterDiscussed = filterForm['filter-discussed'];

  var renderedPhotos = [];

  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  filters.classList.add('hidden');

  function restoreFiltersCheckingMark() {
    if (localStorage.getItem('filterName')) {
      switch (localStorage.getItem('filterName')) {
        case 'new':
          filterNew.checked = true;
          break;
        case 'discussed':
          filterDiscussed.checked = true;
          break;
        case 'popular':
        default:
          filterPopular.checked = true;
          break;
      }
    }
  }

  function renderPhotos(photoItem, pageNumber, replace) {
    replace = typeof replace !== 'undefined' ? replace : true;
    pageNumber = pageNumber || 0;

    if (replace) {
      var element;
      while ((element = renderedPhotos.shift())) {
        element.unrender();
      }
      photosContainer.classList.remove('pictures-failure');
    }

    var photosFragment = document.createDocumentFragment();

    var photosFrom = pageNumber * PAGE_SIZE;
    var photosTo = photosFrom + PAGE_SIZE;

    photoItem = photoItem.slice(photosFrom, photosTo);

    photoItem.forEach(function(photo) {
      var newPhotoElement = new Photo(photo);
      newPhotoElement.render(photosFragment);
      renderedPhotos.push(newPhotoElement);
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

  function comparePhotosByDiscuss(aPhoto, bPhoto) {
    return bPhoto.comments - aPhoto.comments;
  }

  function comparePhotosByPopularity(aPhoto, bPhoto) {
    return bPhoto.likes - aPhoto.likes;
  }

  function filterPhotos(images, filterValue) {
    var filteredPhotos = images.slice(0);
    switch (filterValue) {
      case 'discussed':
        filteredPhotos = filteredPhotos.sort(comparePhotosByDiscuss);
        break;

      case 'new':
        filteredPhotos = filteredPhotos.sort(comparePhotosByDate);
        break;

      case 'popular':
        filteredPhotos = filteredPhotos.sort(comparePhotosByPopularity);
        break;

      default:
        filteredPhotos = images.slice(0);
        break;
    }
    localStorage.setItem('filterName', filterValue);
    return filteredPhotos;
  }

  function setActiveFilter(filterValue) {
    currentPhotos = filterPhotos(photos, filterValue);
    photoUrl = getUrlPhotos(currentPhotos);
    currentPage = 0;
    renderPhotos(currentPhotos, currentPage++, true);
    lotSpace();
  }

  function initFilters() {
    filters.addEventListener('click', function(evt) {
      var clickedFilter = evt.target;
      setActiveFilter(clickedFilter.value);
      clickedFilter.checked = true;
    });
  }

  function isNextPageAvailable() {
    return currentPage < Math.ceil(photos.length / PAGE_SIZE);
  }

  function isAtTheBottom() {
    var GAP = 100;
    return photosContainer.getBoundingClientRect().bottom - GAP <= window.innerHeight;
  }

  function checkNextPage() {
    if (isAtTheBottom() && isNextPageAvailable()) {
      window.dispatchEvent(new CustomEvent('loadneeded'));
    }
  }

  function initScroll() {
    var someTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(someTimeout);
      someTimeout = setTimeout(checkNextPage, 100);
    });

    window.addEventListener('loadneeded', function() {
      renderPhotos(currentPhotos, currentPage++, false);
    });
  }

  function lotSpace() {
    if (photosContainer.getBoundingClientRect().bottom < window.innerHeight) {
      renderPhotos(currentPhotos, currentPage++, false);
    }
  }

  function getUrlPhotos(photoObj) {
    return photoObj.map(function(pht) {
      return pht.url;
    });
  }

  function initGallery() {
    if (!gallery) {
      gallery = new Gallery();

      window.addEventListener('galleryclick', function(evt) {
        console.log('click click');
        gallery.setPhotos(photoUrl);
        console.log(evt.detail.photoElement._data.url);
        //gallery.setCurrentPhoto(evt.detail.photoElement._data.url);
        //gallery.show();
      })
    }
  }

  initFilters();
  initScroll();
  initGallery();

  loadPhotos(function(loadedPhotos) {
    photos = loadedPhotos;
    setActiveFilter(localStorage.getItem('filterName') || 'popular');
    lotSpace();
  });

  filters.classList.remove('hidden');
  restoreFiltersCheckingMark();

})();
