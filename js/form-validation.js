'use strict';

define([
  'resize-picture'
], function(Resizer) {

  var formElements = document.forms['upload-resize'];
  var offsetLeft = formElements['resize-x'];
  var offsetTop = formElements['resize-y'];
  var sizeValue = formElements['resize-size'];
  var resizeForm = document.forms['upload-resize'];
  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var imageHeight;
  var imageWidth;

  offsetLeft.value = 0;
  offsetTop.value = 0;
  sizeValue.value = 50;

  offsetLeft.min = 0;
  offsetTop.min = 0;
  sizeValue.min = 50;

  previewImage.onload = function() {
    imageHeight = previewImage.height;
    imageWidth = previewImage.width;
  };

  sizeValue.onchange = function() {

    if (imageHeight < imageWidth) {
      sizeValue.max = imageHeight;
    } else {
      sizeValue.max = imageWidth;
    }

    if (offsetLeft.value >= imageWidth - sizeValue.value) {
      offsetLeft.value = imageWidth - sizeValue.value;
    }

    if (offsetLeft.value < 0) {
      offsetLeft.value = 0;
    }

    if (offsetTop.value >= imageHeight - sizeValue.value) {
      offsetTop.value = imageHeight - sizeValue.value;
    }

    if (offsetTop.value < 0) {
      offsetTop.value = 0;
    }

    resizer.setConstraint( resizer._resizeConstraint.x + offsetLeft.value, resizer._resizeConstraint.y + offsetTop.value, sizeValue.value);
  };

  offsetLeft.onchange = function() {
    offsetLeft.max = imageWidth - sizeValue.value;
  };

  offsetTop.onchange = function() {
    offsetTop.max = imageHeight - sizeValue.value;
  };

});
