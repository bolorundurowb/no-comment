function removeFacebookComments() {
  var allCommentGroups = $("div[data-vc-ignore-dynamic='1']");
  allCommentGroups.each(function (i) {
    var children = $(this).children();
    var secondDiv = children[1];
    if (secondDiv) {
      $(secondDiv).css({display: 'none'});
    }
  });
}

function restoreFacebookComments() {
  var allCommentGroups = $("div[data-vc-ignore-dynamic='1']");
  allCommentGroups.each(function (i) {
    var children = $(this).children();
    var secondDiv = children[1];
    if (secondDiv) {
      $(secondDiv).css({display: 'block'});
    }
  });
}

function removeYoutubeComments() {
  $('#comments').css({display: 'none'});
}

function restoreYoutubeComments() {
  $('#comments').css({display: 'block'});
}

function addFacebookListeners() {
  $(window).scroll(function () {
    removeFacebookComments();
  });
}

function removeFacebookListeners() {
  $(window).unbind('scroll');
  restoreFacebookComments();
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.isEnabled) {
    if (request.isYoutubeEnabled) {
      removeYoutubeComments();
    } else {
      restoreYoutubeComments();
    }

    if (request.isFacebookEnabled) {
      addFacebookListeners();
    } else {
      removeFacebookListeners();
    }
  } else {
    restoreFacebookComments();
    restoreYoutubeComments();
  }

  sendResponse({});
});
