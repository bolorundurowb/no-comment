var settingsKey = 'no-comment-preferences';
var settings = {};
var youtube = $('#youtube');
var facebook = $('#facebook');
var allSites = $('#all-sites');

window.onload = function () {
  chrome.storage.sync.get(['no-comment-preferences'], (items) => {
    settings = items[settingsKey];

    // determine which options are enabled
    youtube.attr('checked', settings.isYoutubeEnabled);
    facebook.attr('checked', settings.isFacebookEnabled);

    if (settings.isEnabled) {
      // enable the checkboxes
      youtube.attr('disabled', false);
      facebook.attr('disabled', false);
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
  syncSettings();
});

youtube.change(function () {
  settings.isYoutubeEnabled = this.checked;
  syncSettings();
});

facebook.change(function () {
  settings.isFacebookEnabled = this.checked;
  syncSettings();
});

function syncSettings() {
  var data = {};
  data[settingsKey] = settings;
  chrome.storage.sync.set(data, function () {
    console.log('plugin data successfully updated.');
  });
}
