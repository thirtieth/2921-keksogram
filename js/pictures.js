/* global
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

  var gallery = new Gallery();

  var filterForm = document.forms['filters-set'];
  var filterPopular = filterForm['filter-popular'];
  var filterNew = filterForm['filter-new'];
  var filterDiscussed = filterForm['filter-discussed'];

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

  function renderPhotos(pageNumber, replace) {
    replace = typeof replace !== 'undefined' ? replace : true;
    pageNumber = pageNumber || 0;

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

    var photosTemplate = document.getElementById('picture-template');

    photosCollection.slice(photosFrom, photosTo).forEach(function(model) {
      var view = new PhotoView({
        model: model,
        el: photosTemplate.content.children[0].cloneNode(true)
      });
      view.render();
      photosFragment.appendChild(view.el);
      renderedViews.push(view);
      view.on('galleryclick', function() {
        gallery.setPhotos(photosCollection);
        gallery.showPhoto(view.model);
        gallery.show();
      });
    });
    photosContainer.appendChild(photosFragment);
  }

  function showLoadFailure() {
    photosContainer.classList.add('pictures-failure');
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

    }
    photosCollection.reset(filteredPhotos);
    localStorage.setItem('filterName', filterValue);
    return filteredPhotos;
  }

  function setActiveFilter(filterValue) {
    var currentPhotos = filterPhotos(filterValue);
    currentPage = 0;
    renderPhotos(currentPage++, true);
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
      renderPhotos(currentPage++, false);
    });
  }

  function lotSpace() {
    if (photosContainer.getBoundingClientRect().bottom < window.innerHeight) {
      renderPhotos(currentPage++, false);
    }
  }

  photosCollection.fetch({timeout: REQUEST_FAILURE_TIMEOUT}).success(function(loaded, state, jqXHR) {
    initiallyLoaded = jqXHR.responseJSON;

    initFilters();
    initScroll();
    setActiveFilter(localStorage.getItem('filterName') || 'popular');
    lotSpace();
  }).fail(function() {
    showLoadFailure();
  });

  filters.classList.remove('hidden');
  restoreFiltersCheckingMark();

})();
