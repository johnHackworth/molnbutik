window.moln = window.moln || {};

window.moln.lightbox = function() {
  $("[data-lightbox]").on('click', window.moln.lightboxStart);
  $('body').on('click', window.moln.closeLightboxes);
  $('body').on('keyup', window.moln.closeLightboxes);
};

window.moln.lightboxStart = function(ev) {
  ev.stopPropagation();
  var lightboxId = $(ev.currentTarget).attr('data-lightbox');
  var $lightbox = $('#' + lightboxId);
  $lightbox.fadeIn();
  $lightbox.addClass('show');
  $lightbox.find('iframe').attr('src', $lightbox.find('iframe').attr('src') + '?autoplay=1');
  $('body').addClass('hasLightbox');
};

window.moln.closeLightboxes = function(ev) {
  if ($('body').hasClass('hasLightbox')) {
    var $lightboxes = $('.lightbox.show');
    $lightboxes.fadeOut();
    $lightboxes.removeClass('show');
    $iframes = $lightboxes.find('iframe');
    for (var i = 0; i < $iframes.length; i++) {
      var src = $iframes.eq(i).attr('src');
      src = src.replace('?autoplay=1', '');
      $iframes.eq(i).attr('src', src);
    }
    $('body').removeClass('hasLightbox');
  }
};



$(document).ready(window.moln.lightbox);