/* global
     Photo: true
     Gallery: true
     PhotosCollection: true
     PhotoView: true
*/

'use strict';

(function() {
  var filters = document.querySelector('.filters');

  var photosContainer = document.querySelector('.pictures');
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var PAGE_SIZE = 12;
  var currentPage = 0;

  var photosCollection = new PhotosCollection();
  var initiallyLoaded = [];
  var renderedViews = [];


  var photos;
  var currentPhotos;
  var gallery;
  var photoUrl;

  var filterForm = document.forms['filters-set'];
  var filterPopular = filterForm['filter-popular'];
  var filterNew = filterForm['filter-new'];
  var filterDiscussed = filterForm['filter-discussed'];
//
//  var renderedPhotos = [];
//
//
//
//  var ReadyState = {
//    'UNSENT': 0,
//    'OPENED': 1,
//    'HEADERS_RECEIVED': 2,
//    'LOADING': 3,
//    'DONE': 4
//  };

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

//    if (replace) {
//      var element;
//      while ((element = renderedPhotos.shift())) {
//        element.dispose();
//      }
//      photosContainer.classList.remove('pictures-failure');
//    }
    if (replace) {
      while (renderedViews.length) {
        var viewToRemove = renderedViews.shift();

        photosContainer.removeChild(viewToRemove.el);
        photosContainer.classList.remove('pictures-failure');
        viewToRemove.off('galleryclick');
        viewToRemove.remove();
      }
    }

    var photosFragment = document.createDocumentFragment();

    var photosFrom = pageNumber * PAGE_SIZE;
    var photosTo = photosFrom + PAGE_SIZE;

//    photoItem = photoItem.slice(photosFrom, photosTo);
//
//    photoItem.forEach(function(photo) {
//      var newPhotoObject = new Photo(photo);
//      newPhotoObject.render(photosFragment);
//      renderedPhotos.push(newPhotoObject);
//    });
//
    photosCollection.slice(photosFrom, photosTo).forEach(function(model) {
      var view = new PhotoView({ model: model });
      view.render();
      photosFragment.appendChild(view.el);
      renderedViews.push(view);
      view.on('galleryclick', function() {
        gallery.setPhotos(view.model.get('url'));
        gallery.setCurrentPhoto(0);
        gallery.show();
      });
    });
    photosContainer.appendChild(photosFragment);
  }

  function showLoadFailure() {
    photosContainer.classList.add('pictures-failure');
  }

//  function loadData(url, onComplete, onError, onProgress) {
//    var xhr = new XMLHttpRequest();
//    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
//    xhr.open('get', url);
//    xhr.send();
//
//    xhr.onreadystatechange = function(evt) {
//      var loadedXhr = evt.target;
//
//      switch (loadedXhr.readyState) {
//        case ReadyState.OPENED:
//        case ReadyState.HEADERS_RECEIVED:
//        case ReadyState.LOADING:
//          onProgress();
//          break;
//
//        case ReadyState.DONE:
//        default:
//          if (loadedXhr.status === 200) {
//            var data = loadedXhr.response;
//            onComplete(JSON.parse(data));
//          }
//
//          if (loadedXhr.status > 400) {
//            onError();
//          }
//          break;
//      }
//    };
//
//    xhr.ontimeout = function() {
//      onError();
//    };
//  }

//  function loadPhotos(callback) {
//    loadData(
//      'data/pictures.json',
//      function(json) {
//        photosContainer.classList.remove('pictures-loading');
//        callback(json);
//      },
//      showLoadFailure,
//      function() {
//        photosContainer.classList.add('pictures-loading');
//      }
//    );
//  }

  function comparePhotosByDate(aPhoto, bPhoto) {
    return Date.parse(bPhoto.date) - Date.parse(aPhoto.date);
  }

  function comparePhotosByDiscuss(aPhoto, bPhoto) {
    return bPhoto.comments - aPhoto.comments;
  }

  function comparePhotosByPopularity(aPhoto, bPhoto) {
    return bPhoto.likes - aPhoto.likes;
  }

  function filterPhotos(filterValue) {
    var filteredPhotos = initiallyLoaded.slice(0);
    switch (filterValue) {
      case 'discussed':
        filteredPhotos = filteredPhotos.sort(comparePhotosByDiscuss);
        break;

      case 'new':
        filteredPhotos = filteredPhotos.sort(comparePhotosByDate);
        break;

      case 'popular':
      default:
        filteredPhotos = filteredPhotos.sort(comparePhotosByPopularity);
        break;

//      default:
//        filteredPhotos = initiallyLoaded.slice(0);
//        break;
    }
    photosCollection.reset(filteredPhotos);
    localStorage.setItem('filterName', filterValue);
    return filteredPhotos;
  }

  function setActiveFilter(filterValue) {
    currentPhotos = filterPhotos(filterValue);
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
    return currentPage < Math.ceil(photosCollection.length / PAGE_SIZE);
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

//  function initGallery() {
//    if (!gallery) {
//      gallery = new Gallery();
//
//      window.addEventListener('galleryclick', function(evt) {
//        gallery.setPhotos(photoUrl);
//        var index = gallery._photos.indexOf(evt.detail.photoElement._data.url);
//        gallery.setCurrentPhoto(index);
//        gallery._showCurrentPhoto();
//        gallery.show();
//      });
//    }
//  }

  photosCollection.fetch({timeout: REQUEST_FAILURE_TIMEOUT}).success(function(loaded, state, jqXHR) {
    initiallyLoaded = jqXHR.responseJSON;

    initFilters();
    initScroll();
    //initGallery();

   // loadPhotos(function(loadedPhotos) {
  //    photos = loadedPhotos;
    setActiveFilter(localStorage.getItem('filterName') || 'popular');
    lotSpace();
  //  });
  }).fail(function() {
    showLoadFailure();
  });

  filters.classList.remove('hidden');
  restoreFiltersCheckingMark();

})();
