(function() {

  var formElements = document.forms['upload-resize'];
  var formFilters = document.forms['upload-filter'];
  var offsetLeft = formElements['resize-x'];
  var offsetTop = formElements['resize-y'];
  var sizeValue = formElements['resize-size'];
  var resizeForm = document.forms['upload-resize'];
  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var imageHeight;
  var imageWidth;
  var filterNone = formFilters['upload-filter-none'];
  var filterChrome = formFilters['upload-filter-chrome'];
  var filterSepia = formFilters['upload-filter-sepia'];

  var restoreFiltersValue = function() {
    if(docCookies.hasItem(filterNone.name)) {
      filterNone.value = docCookies.getItem(filterNone.name);
    }
    if(docCookies.hasItem(filterChrome.name)) {
      filterChrome.value = docCookies.getItem(filterChrome.name);
    }
    if(docCookies.hasItem(filterSepia.name)) {
      filterSepia.value = docCookies.getItem(filterSepia.name);
    }
  };

  offsetLeft.value = 0;
  offsetTop.value = 0;
  sizeValue.value = 50;

  offsetLeft.min = 0;
  offsetTop.min = 0;
  sizeValue.min = 50;

  restoreFiltersValue();

  previewImage.onload = function(evt) {
    imageHeight = previewImage.height;
    imageWidth = previewImage.width;
  };

  sizeValue.onchange = function(evt) {

    if(imageHeight < imageWidth) {
      sizeValue.max = imageHeight;
    }
    else {
      sizeValue.max = imageWidth;
    }

    if(offsetLeft.value >= imageWidth - sizeValue.value) {
      offsetLeft.value = imageWidth - sizeValue.value;
    }

    if(offsetLeft.value < 0) {
      offsetLeft.value = 0;
    }

    if(offsetTop.value >= imageHeight - sizeValue.value) {
      offsetTop.value = imageHeight - sizeValue.value;
    }

    if(offsetTop.value < 0) {
      offsetTop.value = 0;
    }
  };

  offsetLeft.onchange = function(evt) {
    offsetLeft.max = imageWidth - sizeValue.value;
  };

  offsetTop.onchange = function(evt) {
    offsetTop.max = imageHeight - sizeValue.value;
  };

  formFilters.onsubmit = function(evt) {
    evt.preventDefault();

    var timeShift = new Date() - new Date(1982, 10, 21);

    docCookies.setItem(filterNone.name, filterNone.value, new Date() + timeShift);
    docCookies.setItem(filterChrome.name, filterChrome.value, new Date() + timeShift);
    docCookies.setItem(filterSepia.name, filterSepia.value, new Date() + timeShift);

    formElements.submit();

  };

})();
