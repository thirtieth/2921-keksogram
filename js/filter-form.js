(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = filterForm.querySelector('.filter-image-preview');
  var prevButton = filterForm['filter-prev'];
  var selectedFilter = filterForm['upload-filter'];

  var filterNone = filterForm['upload-filter-none'];
  var filterChrome = filterForm['upload-filter-chrome'];
  var filterSepia = filterForm['upload-filter-sepia'];

  var filterMap;

  var restoreFiltersValue = function() {
    if(docCookies.hasItem(filterNone.value)) {
      filterNone.checked = true;
    }
    if(docCookies.hasItem(filterChrome.value)) {
      filterChrome.checked = true;
    }
    if(docCookies.hasItem(filterSepia.value)) {
      filterSepia.checked = true;
    }
  };

  restoreFiltersValue();

  function setFilter() {
    if (!filterMap) {
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    previewImage.className = 'filter-image-preview' + ' ' + filterMap[selectedFilter.value];
  };

  for (var i = 0, l = selectedFilter.length; i < l; i++) {
    selectedFilter[i].onchange = function(evt) {
      setFilter();
    }
  }

  prevButton.onclick = function(evt) {
    evt.preventDefault();

    filterForm.reset();
    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  };

  filterForm.onsubmit = function(evt) {
    evt.preventDefault();

    uploadForm.classList.remove('invisible');
    filterForm.classList.add('invisible');

    if(filterSepia.checked) {
      docCookies.setItem(filterSepia.value);
    }
    else if(filterChrome.checked) {
      docCookies.setItem(filterChrome.value);
    }
    else {
      docCookies.setItem(filterNone.value);
    }

    filterForm.submit();

  };

  setFilter();
})();




