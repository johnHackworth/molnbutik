window.moln = window.moln || {};

window.moln.colors = ['green', 'pink', 'blue', 'yellow', 'peach'];

window.moln.randomLogoColor = function() {
  var $headerLogo = $('header .logo');
  for (var i in moln.colors) {
    $headerLogo.removeClass(moln.colors[i])
  };
  var newColor = moln.colors[Math.floor(Math.random() * moln.colors.length)];
  $headerLogo.addClass(newColor);
  if (Math.random() > 0.99) {
    $headerLogo.addClass('flip');
  }

}

$(document).ready(function() {
  moln.randomLogoColor();
  setInterval(moln.randomLogoColor, 5000);
})