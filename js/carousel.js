window.moln = window.moln || {};

window.moln.carousel = function() {
  $(".imageCarousel .miniImg").on('click', window.moln.selectImage)
}

window.moln.selectImage = function(ev) {
  var $image = $(ev.currentTarget)
  $('.mainImage img').attr('src', $image.attr('data-src'));
}

$(document).ready(window.moln.carousel);
