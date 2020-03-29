var youtube = $('#youtube');
var facebook = $('#facebook');
var allSites = $('#all-sites');

window.onload = function () {
  chrome.storage.sync.get(['no-comment-preferences'], (items) => {
    var settings = items['no-comment-preferences'];

    if (settings.isEnabled) {
      // enable the checkboxes
      youtube.attr('disabled', false);
      facebook.attr('disabled', false);

      // determine which options are enabled
      youtube.attr('checked', settings.isYoutubeEnabled);
      facebook.attr('checked', settings.isFacebookEnabled);
    } else {
      allSites.attr('checked', false);
    }
  });
};

// handle clicks
allSites.change(function () {
  var isEnabled = this.checked;

  // update ui
  allSites.attr('checked', isEnabled);
  youtube.attr('disabled', !isEnabled);
  facebook.attr('disabled', !isEnabled);

  console.log(isEnabled);
});
