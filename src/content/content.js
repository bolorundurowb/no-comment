var settingsKey = 'no-comment-preferences';

var isFacebookHost = location.hostname.includes('facebook.com');
var isYoutubeHost = location.hostname.includes('youtube.com');
var isRedditHost =
  location.hostname === 'reddit.com' || location.hostname.endsWith('.reddit.com');

var facebookScrollBound = false;
var youtubeObserver = null;
var youtubeMutationRaf = 0;
var redditObserver = null;
var redditMutationRaf = 0;

/** Selectors for Reddit comment UI (new shreddit UI + old.reddit.com). */
var REDDIT_COMMENT_ROOT_SELECTORS = [
  'shreddit-comments',
  'shreddit-comment-tree',
  '.commentarea'
];

function clearDisplay(el) {
  if (el) {
    el.style.removeProperty('display');
  }
}

function setDisplay(el, value) {
  if (el) {
    el.style.display = value;
  }
}

function removeFacebookComments() {
  if (!isFacebookHost) {
    return;
  }
  var groups = document.querySelectorAll("div[data-vc-ignore-dynamic='1']");
  groups.forEach(function (group) {
    var children = group.children;
    var secondDiv = children[1];
    if (secondDiv) {
      secondDiv.style.display = 'none';
    }
  });
}

function restoreFacebookComments() {
  if (!isFacebookHost) {
    return;
  }
  var groups = document.querySelectorAll("div[data-vc-ignore-dynamic='1']");
  groups.forEach(function (group) {
    var children = group.children;
    var secondDiv = children[1];
    if (secondDiv) {
      clearDisplay(secondDiv);
    }
  });
}

function removeYoutubeComments() {
  if (!isYoutubeHost) {
    return;
  }
  setDisplay(document.getElementById('comments'), 'none');
  document.querySelectorAll('ytd-comments').forEach(function (el) {
    el.style.display = 'none';
  });
}

function restoreYoutubeComments() {
  if (!isYoutubeHost) {
    return;
  }
  clearDisplay(document.getElementById('comments'));
  document.querySelectorAll('ytd-comments').forEach(function (el) {
    clearDisplay(el);
  });
}

function stopYoutubeMutationObserver() {
  if (youtubeMutationRaf) {
    cancelAnimationFrame(youtubeMutationRaf);
    youtubeMutationRaf = 0;
  }
  if (youtubeObserver) {
    youtubeObserver.disconnect();
    youtubeObserver = null;
  }
}

function startYoutubeMutationObserver() {
  if (!isYoutubeHost) {
    return;
  }
  stopYoutubeMutationObserver();
  var root = document.documentElement || document.body;
  if (!root) {
    return;
  }
  youtubeObserver = new MutationObserver(function () {
    if (youtubeMutationRaf) {
      cancelAnimationFrame(youtubeMutationRaf);
    }
    youtubeMutationRaf = requestAnimationFrame(function () {
      youtubeMutationRaf = 0;
      removeYoutubeComments();
    });
  });
  youtubeObserver.observe(root, { childList: true, subtree: true });
}

function collectRedditCommentRoots() {
  var seen = new Set();
  var out = [];
  REDDIT_COMMENT_ROOT_SELECTORS.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (!seen.has(el)) {
        seen.add(el);
        out.push(el);
      }
    });
  });
  return out;
}

function removeRedditComments() {
  if (!isRedditHost) {
    return;
  }
  collectRedditCommentRoots().forEach(function (el) {
    el.style.display = 'none';
  });
}

function restoreRedditComments() {
  if (!isRedditHost) {
    return;
  }
  collectRedditCommentRoots().forEach(function (el) {
    clearDisplay(el);
  });
}

function stopRedditMutationObserver() {
  if (redditMutationRaf) {
    cancelAnimationFrame(redditMutationRaf);
    redditMutationRaf = 0;
  }
  if (redditObserver) {
    redditObserver.disconnect();
    redditObserver = null;
  }
}

function startRedditMutationObserver() {
  if (!isRedditHost) {
    return;
  }
  stopRedditMutationObserver();
  var root = document.documentElement || document.body;
  if (!root) {
    return;
  }
  redditObserver = new MutationObserver(function () {
    if (redditMutationRaf) {
      cancelAnimationFrame(redditMutationRaf);
    }
    redditMutationRaf = requestAnimationFrame(function () {
      redditMutationRaf = 0;
      removeRedditComments();
    });
  });
  redditObserver.observe(root, { childList: true, subtree: true });
}

function onFacebookScroll() {
  removeFacebookComments();
}

function enableFacebookCommentHiding() {
  if (!isFacebookHost) {
    return;
  }
  if (!facebookScrollBound) {
    window.addEventListener('scroll', onFacebookScroll, { passive: true });
    facebookScrollBound = true;
  }
  removeFacebookComments();
}

function disableFacebookCommentHiding() {
  if (!isFacebookHost) {
    return;
  }
  if (facebookScrollBound) {
    window.removeEventListener('scroll', onFacebookScroll);
    facebookScrollBound = false;
  }
  restoreFacebookComments();
}

function enableYoutubeCommentHiding() {
  if (!isYoutubeHost) {
    return;
  }
  removeYoutubeComments();
  startYoutubeMutationObserver();
}

function disableYoutubeCommentHiding() {
  if (!isYoutubeHost) {
    return;
  }
  stopYoutubeMutationObserver();
  restoreYoutubeComments();
}

function enableRedditCommentHiding() {
  if (!isRedditHost) {
    return;
  }
  removeRedditComments();
  startRedditMutationObserver();
}

function disableRedditCommentHiding() {
  if (!isRedditHost) {
    return;
  }
  stopRedditMutationObserver();
  restoreRedditComments();
}

function isSettingsPayload(msg) {
  return msg && typeof msg === 'object' && typeof msg.isEnabled === 'boolean';
}

function normalizeSiteSettings(raw) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  return {
    isEnabled: raw.isEnabled !== false,
    isYoutubeEnabled: raw.isYoutubeEnabled !== false,
    isFacebookEnabled: raw.isFacebookEnabled !== false,
    isRedditEnabled: raw.isRedditEnabled !== false
  };
}

function applySettings(raw) {
  if (!isSettingsPayload(raw)) {
    return;
  }
  var settings = normalizeSiteSettings(raw);
  if (!settings) {
    return;
  }
  if (!settings.isEnabled) {
    disableFacebookCommentHiding();
    disableYoutubeCommentHiding();
    disableRedditCommentHiding();
    return;
  }
  if (isYoutubeHost) {
    if (settings.isYoutubeEnabled) {
      enableYoutubeCommentHiding();
    } else {
      disableYoutubeCommentHiding();
    }
  }
  if (isFacebookHost) {
    if (settings.isFacebookEnabled) {
      enableFacebookCommentHiding();
    } else {
      disableFacebookCommentHiding();
    }
  }
  if (isRedditHost) {
    if (settings.isRedditEnabled) {
      enableRedditCommentHiding();
    } else {
      disableRedditCommentHiding();
    }
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  applySettings(request);
  sendResponse({});
});

function initFromStorage() {
  chrome.storage.sync.get([settingsKey], function (items) {
    var raw = items[settingsKey];
    if (!raw) {
      return;
    }
    applySettings(raw);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFromStorage);
} else {
  initFromStorage();
}
