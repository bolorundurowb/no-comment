window.onload = function () {
  chrome.storage.sync.get(['no-comment-preferences'], function (items) {
    var settings = items['no-comment-preferences'];
    console.log(settings, $);

    if (settings.isEnabled) {
      $('all-sites').attr('checked', true);
    } else {
      $('all-sites').attr('disabled', true);
      $('youtube').attr('disabled', true);
      $('facebook').attr('disabled', true);
    }
  });
};
