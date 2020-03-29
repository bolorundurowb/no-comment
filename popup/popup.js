var settingsKey = 'no-comment-preferences';
var settings = {};
var youtube = $('#youtube');
var facebook = $('#facebook');
var allSites = $('#all-sites');

window.onload = function () {
  chrome.storage.sync.get(['no-comment-preferences'], (items) => {
    settings = items[settingsKey];

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
  settings.isEnabled = isEnabled;

  // update ui
  allSites.attr('checked', isEnabled);
  youtube.attr('disabled', !isEnabled);
  facebook.attr('disabled', !isEnabled);

  // update the sync the settings
  console.log(settings);
  var data = {};
  data[settingsKey] = settings;
  chrome.storage.sync.set(data, function () {
    console.log('plugin successfully disabled.');
  });
});
