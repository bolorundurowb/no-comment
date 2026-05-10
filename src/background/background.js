var settingsKey = 'no-comment-preferences';

chrome.runtime.onInstalled.addListener(function () {
  seedExtensionSettings();
  syncActionStateForAllTabs();
});
chrome.runtime.onStartup.addListener(function () {
  seedExtensionSettings();
  syncActionStateForAllTabs();
});

// Reconcile toolbar action whenever the service worker starts (Chromium + Firefox).
syncActionStateForAllTabs();

function seedExtensionSettings() {
  chrome.storage.sync.get(settingsKey, function (items) {
    // if there are no preferences then seed
    if (!items[settingsKey]) {
      var data = {};
      data[settingsKey] = {
        isEnabled: true,
        isFacebookEnabled: true,
        isYoutubeEnabled: true
      };
      chrome.storage.sync.set(data, function () {
        console.log('plugin preferences seeded.')
      });
    }
  })
}

function urlSupportsExtension(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }
  if (/^(chrome|about|edge|devtools|view-source|chrome-extension|moz-extension|extension):/i.test(url)) {
    return false;
  }
  try {
    var host = new URL(url).hostname.toLowerCase();
    return host.includes('youtube.com') || host.includes('facebook.com');
  } catch (e) {
    return false;
  }
}

function updateActionForTab(tabId, url) {
  if (tabId == null) {
    return;
  }
  if (urlSupportsExtension(url)) {
    chrome.action.enable(tabId);
  } else {
    chrome.action.disable(tabId);
  }
}

function syncActionStateForAllTabs() {
  chrome.tabs.query({}, function (tabs) {
    if (chrome.runtime.lastError || !tabs || !tabs.length) {
      return;
    }
    tabs.forEach(function (tab) {
      updateActionForTab(tab.id, tab.url);
    });
  });
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    updateActionForTab(tabId, changeInfo.url);
  }
  if (changeInfo.status === 'complete') {
    updateActionForTab(tabId, tab.url);
  }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    if (chrome.runtime.lastError || !tab) {
      return;
    }
    updateActionForTab(tab.id, tab.url);
  });
});
