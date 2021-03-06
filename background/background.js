var settingsKey = 'no-comment-preferences';

chrome.runtime.onInstalled.addListener(function () {
  seedExtensionSettings();
});
chrome.runtime.onStartup.addListener(function () {
  seedExtensionSettings();
});

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

chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostContains: 'facebook.com'}
      }), new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostContains: 'youtube.com'}
      })], actions: [new chrome.declarativeContent.ShowPageAction()]
  }]);
});
