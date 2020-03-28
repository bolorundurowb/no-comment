window.onload = function () {
  chrome.storage.sync.get(['no-comment-preferences'], function (items) {
    var settings = items['no-comment-preferences'];

    if (settings.isEnabled) {
      var youtube = $('#youtube');
      var facebook = $('#facebook');

      // enable the checkboxes
      youtube.attr('disabled', false);
      facebook.attr('disabled', false);

      // determine which options are enabled
      youtube.attr('checked', settings.isYoutubeEnabled);
      facebook.attr('checked', settings.isFacebookEnabled);
    } else {
      $('#all-sites').attr('checked', false);
    }
  });
};
