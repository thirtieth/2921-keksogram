/* global resizer: true */

'use strict';

define([
  'resize-picture'
], function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var prevButton = resizeForm['resize-prev'];

  var offsetLeft = resizeForm['resize-x'];
  var offsetTop = resizeForm['resize-y'];
  var sizeValue = resizeForm['resize-size'];
  var imageHeight;
  var imageWidth;
  var imageConstraint;

  window.addEventListener('imagecreated', function() {
    imageConstraint = resizer.getConstraint();
    imageHeight = imageConstraint.side + imageConstraint.y * 2;
    imageWidth = imageConstraint.side + imageConstraint.x * 2;

    offsetLeft.value = parseInt(imageConstraint.x);
    offsetTop.value = parseInt(imageConstraint.y);
    sizeValue.value = parseInt(imageConstraint.side);

    offsetLeft.min = 0;
    offsetTop.min = 0;
    sizeValue.min = 50;
  });

  window.addEventListener('resizerchange', function() {
    var x = parseInt(resizer.getConstraint().x);
    var y = parseInt(resizer.getConstraint().y);
    var maxValueX = x + parseInt(imageConstraint.side);
    var maxValueY = y + parseInt(imageConstraint.side);

    if (x < 0) {
      offsetLeft.value = 0;
      resizer.setConstraint(offsetLeft.value, offsetTop.value, sizeValue.value);
    }

    if (maxValueX > imageWidth) {
      offsetLeft.value = imageWidth - parseInt(imageConstraint.side);
      resizer.setConstraint(offsetLeft.value, offsetTop.value, sizeValue.value);
    }

    if (y < 0) {
      offsetTop.value = 0;
      resizer.setConstraint(offsetLeft.value, offsetTop.value, sizeValue.value);
    }

    if (maxValueY > imageHeight) {
      offsetTop.value = imageHeight - parseInt(imageConstraint.side);
      resizer.setConstraint(offsetLeft.value, offsetTop.value, sizeValue.value);
    }

    offsetLeft.value = parseInt(resizer.getConstraint().x);
    offsetTop.value = parseInt(resizer.getConstraint().y);
  });

  sizeValue.onchange = function() {
    if (imageHeight < imageWidth) {
      sizeValue.max = imageHeight;
    } else {
      sizeValue.max = imageWidth;
    }

    if (offsetLeft.value >= imageWidth - sizeValue.value) {
      offsetLeft.value = parseInt(imageWidth - sizeValue.value);
    }

    if (offsetLeft.value < 0) {
      offsetLeft.value = 0;
    }

    if (offsetTop.value >= imageHeight - sizeValue.value) {
      offsetTop.value = parseInt(imageHeight - sizeValue.value);
    }

    if (offsetTop.value < 0) {
      offsetTop.value = 0;
    }

    resizer.setConstraint(offsetLeft.value, offsetTop.value, sizeValue.value);
  };

  offsetLeft.onchange = function() {
    offsetLeft.max = imageWidth - sizeValue.value;
    resizer.setConstraint(offsetLeft.value, offsetTop.value, sizeValue.value);
  };

  offsetTop.onchange = function() {
    offsetTop.max = imageHeight - sizeValue.value;
    resizer.setConstraint(offsetLeft.value, offsetTop.value, sizeValue.value);
  };


  prevButton.onclick = function(evt) {
    evt.preventDefault();

    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();

    var image = resizer.exportImage();

    filterForm.elements['filter-image-src'].src = image.src;

    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };


});
