function removeFacebookComments() {

}

function restoreFacebookComments() {

}

function removeYoutubeComments() {

}

function restoreYoutubeComments() {

}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.isEnabled) {
    if (request.isYoutubeEnabled) {
      removeYoutubeComments();
    } else {
      restoreYoutubeComments();
    }

    if (request.isFacebookEnabled) {
      removeFacebookComments();
    } else {
      restoreFacebookComments();
    }
  } else {
    restoreFacebookComments();
    restoreYoutubeComments();
  }

  sendResponse({});
});
