var settingsKey = 'no-comment-preferences';
var settings = null;
var settingsLoaded = false;
var youtube = document.getElementById('youtube');
var facebook = document.getElementById('facebook');
var reddit = document.getElementById('reddit');
var allSites = document.getElementById('all-sites');

var TARGET_TAB_URLS = [
  'https://*.youtube.com/*',
  'https://*.facebook.com/*',
  'https://*.reddit.com/*',
  'https://reddit.com/*'
];

function t(messageName, substitutions) {
  return chrome.i18n.getMessage(messageName, substitutions);
}

function applyPopupLocale() {
  document.documentElement.lang = 'en-NG';
  document.title = t('popupDocumentTitle');
  var heading = document.getElementById('popup-heading');
  if (heading) {
    heading.textContent = t('popupHeading');
  }
  var el = document.getElementById('label-enable-extension');
  if (el) {
    el.textContent = t('popupEnableExtension');
  }
  el = document.getElementById('label-youtube');
  if (el) {
    el.textContent = t('popupEnableYoutube');
  }
  el = document.getElementById('label-facebook');
  if (el) {
    el.textContent = t('popupEnableFacebook');
  }
  el = document.getElementById('label-reddit');
  if (el) {
    el.textContent = t('popupEnableReddit');
  }
  var yt = document.getElementById('icon-youtube');
  if (yt) {
    yt.alt = t('iconAltYoutube');
  }
  var fb = document.getElementById('icon-facebook');
  if (fb) {
    fb.alt = t('iconAltFacebook');
  }
  var rd = document.getElementById('icon-reddit');
  if (rd) {
    rd.alt = t('iconAltReddit');
  }
}

applyPopupLocale();

function defaultSettings() {
  return {
    isEnabled: true,
    isFacebookEnabled: true,
    isYoutubeEnabled: true,
    isRedditEnabled: true
  };
}

function mergeSettings(stored) {
  return Object.assign(defaultSettings(), stored || {});
}

function persistAndBroadcast() {
  if (!settings) {
    return;
  }
  var data = {};
  data[settingsKey] = settings;
  chrome.storage.sync.set(data, function () {
    if (chrome.runtime.lastError) {
      console.error(
        t('logSettingsSaveFailed'),
        chrome.runtime.lastError.message
      );
      return;
    }
    console.log(t('logSettingsSaved'));
  });

  chrome.tabs.query({ url: TARGET_TAB_URLS }, function (tabs) {
    if (chrome.runtime.lastError || !tabs) {
      return;
    }
    var sent = 0;
    tabs.forEach(function (tab) {
      if (tab.id == null) {
        return;
      }
      chrome.tabs.sendMessage(tab.id, settings, function () {
        void chrome.runtime.lastError;
      });
      sent += 1;
    });
    if (sent > 0) {
      console.log(t('logTabsUpdated'));
    }
  });
}

window.addEventListener('load', function () {
  chrome.storage.sync.get([settingsKey], function (items) {
    settings = mergeSettings(items[settingsKey]);
    if (!items[settingsKey]) {
      var seed = {};
      seed[settingsKey] = settings;
      chrome.storage.sync.set(seed, function () {
        void chrome.runtime.lastError;
      });
    }

    allSites.checked = settings.isEnabled;
    youtube.checked = settings.isYoutubeEnabled;
    facebook.checked = settings.isFacebookEnabled;
    reddit.checked = settings.isRedditEnabled;

    youtube.disabled = !settings.isEnabled;
    facebook.disabled = !settings.isEnabled;
    reddit.disabled = !settings.isEnabled;

    settingsLoaded = true;
  });
});

allSites.addEventListener('change', function () {
  if (!settingsLoaded || !settings) {
    return;
  }
  settings.isEnabled = allSites.checked;
  youtube.disabled = !settings.isEnabled;
  facebook.disabled = !settings.isEnabled;
  reddit.disabled = !settings.isEnabled;
  persistAndBroadcast();
});

youtube.addEventListener('change', function () {
  if (!settingsLoaded || !settings) {
    return;
  }
  settings.isYoutubeEnabled = youtube.checked;
  persistAndBroadcast();
});

facebook.addEventListener('change', function () {
  if (!settingsLoaded || !settings) {
    return;
  }
  settings.isFacebookEnabled = facebook.checked;
  persistAndBroadcast();
});

reddit.addEventListener('change', function () {
  if (!settingsLoaded || !settings) {
    return;
  }
  settings.isRedditEnabled = reddit.checked;
  persistAndBroadcast();
});
