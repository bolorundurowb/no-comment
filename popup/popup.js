window.onload = function () {
  chrome.storage.local.get(['no-comment-preferences'], function (settings) {
    console.log(settings);
    console.log(settings['no-comment-preferences']);
    console.log('Retrieved at ', new Date());
  })
};
