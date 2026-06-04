import {
  hidePosts4BoardByReplies,
  hidePostsBoardByReplies,
  filterPostsByReactions,
  filterVideosByViews,
  hideNoize,
} from "./contentScripts.js";

export const STORAGE_KEY = "data";

chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
  const tabId = tab?.id;
  if (tabId) {
    chrome.scripting.executeScript({
      target: { tabId },
      func: () =>
        document.styleSheets
          .item(1)
          ?.insertRule("[hidden] { display: none !important; }"),
    });
  }
});

export const handleClick = async (posts: number, hideForwarded?: boolean) => {
  const [[tab]] = await Promise.all([
    chrome.tabs.query({ active: true, currentWindow: true }),
    chrome.storage.sync.set({
      [STORAGE_KEY]: {
        postsNumber: posts,
        hideForwarded,
      },
    }),
  ]);

  const tabId = tab?.id;

  if (tabId) {
    const url = (tab.url || "").split("/").at(2) as keyof typeof urlToMethod;
    const method = urlToMethod[url] ?? hidePostsBoardByReplies;

    chrome.scripting.executeScript({
      target: { tabId },
      func: method,
      args: [STORAGE_KEY],
    });
  }
};

const urlToMethod = {
  "web.telegram.org": filterPostsByReactions,
  "www.youtube.com": filterVideosByViews,
  "boards.4chan.org": hidePosts4BoardByReplies,
  "www.ozon.ru": hideNoize,
};
