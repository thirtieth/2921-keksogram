'use strict';

define([
  'resize-picture'
], function(Resizer) {
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

  /**
  * Обработчик события создания фото в форме кадрирования
  */
  window.addEventListener('imagecreated', function() {
    imageConstraint = Resizer.instance.getConstraint();
    imageHeight = imageConstraint.side + imageConstraint.y * 2;
    imageWidth = imageConstraint.side + imageConstraint.x * 2;

    offsetLeft.value = parseInt(imageConstraint.x, 10);
    offsetTop.value = parseInt(imageConstraint.y, 10);
    sizeValue.value = parseInt(imageConstraint.side, 10);

    offsetLeft.min = 0;
    offsetTop.min = 0;
    sizeValue.min = 50;
  });

  /**
  * Обработчик события изменения рамки кадрирования
  */
  window.addEventListener('resizerchange', function() {
    var x = parseInt(Resizer.instance.getConstraint().x, 10);
    var y = parseInt(Resizer.instance.getConstraint().y, 10);
    var maxValueX = x + parseInt(imageConstraint.side, 10);
    var maxValueY = y + parseInt(imageConstraint.side, 10);

    if (x < 0) {
      offsetLeft.value = 0;
      Resizer.instance.setConstraint(offsetLeft.value, offsetTop.value, sizeValue.value);
    }

    if (maxValueX > imageWidth) {
      offsetLeft.value = imageWidth - parseInt(imageConstraint.side, 10);
      Resizer.instance.setConstraint(offsetLeft.value, offsetTop.value, sizeValue.value);
    }

    if (y < 0) {
      offsetTop.value = 0;
      Resizer.instance.setConstraint(offsetLeft.value, offsetTop.value, sizeValue.value);
    }

    if (maxValueY > imageHeight) {
      offsetTop.value = imageHeight - parseInt(imageConstraint.side, 10);
      Resizer.instance.setConstraint(offsetLeft.value, offsetTop.value, sizeValue.value);
    }

    offsetLeft.value = parseInt(Resizer.instance.getConstraint().x, 10);
    offsetTop.value = parseInt(Resizer.instance.getConstraint().y, 10);
  });

  /**
   * Обработчик ввода значения в поле "Сторона"
   */
  sizeValue.onchange = function() {
    if (imageHeight < imageWidth) {
      sizeValue.max = imageHeight;
    } else {
      sizeValue.max = imageWidth;
    }

    if (offsetLeft.value >= imageWidth - sizeValue.value) {
      offsetLeft.value = parseInt(imageWidth - sizeValue.value, 10);
    }

    if (offsetLeft.value < 0) {
      offsetLeft.value = 0;
    }

    if (offsetTop.value >= imageHeight - sizeValue.value) {
      offsetTop.value = parseInt(imageHeight - sizeValue.value, 10);
    }

    if (offsetTop.value < 0) {
      offsetTop.value = 0;
    }

    if (sizeValue.value > sizeValue.max) {
      sizeValue.value = sizeValue.max;
    }

    Resizer.instance.setConstraint(offsetLeft.value, offsetTop.value, sizeValue.value);
  };

  /**
   * Обработчик ввода значения в поле "Слева"
   */
  offsetLeft.onchange = function() {
    offsetLeft.max = imageWidth - sizeValue.value;
    Resizer.instance.setConstraint(offsetLeft.value, offsetTop.value, sizeValue.value);
  };

  /**
   * Обработчик ввода значения в поле "Сверху"
   */
  offsetTop.onchange = function() {
    offsetTop.max = imageHeight - sizeValue.value;
    Resizer.instance.setConstraint(offsetLeft.value, offsetTop.value, sizeValue.value);
  };

  /**
   * Обработчик клика на кнопке назад
   */
  prevButton.onclick = function(evt) {
    evt.preventDefault();

    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  /**
   * Обработчик клика на кнопке вперед
   */
  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();

    var image = Resizer.instance.exportImage();

    filterForm.elements['filter-image-src'].src = image.src;

    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };


});
