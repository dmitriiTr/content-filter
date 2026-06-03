import {
  hidePosts4BoardByReplies,
  hidePostsBoardByReplies,
  filterPostsByReactions,
  filterVideosByViews,
} from "./contentScripts.js";

const STORAGE_KEY = "data";

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

// chrome.storage.sync.get(STORAGE_KEY).then(({ data }) => {
//   const input = document.querySelector("#postnumber");
//   if (input && data) {
//     input.value = data.postNumber.toString();
//   }
// });

export const handleClick = async (posts: number) => {
  // const hideForwarded = !!(
  //   document.querySelector("#hide_forwarded") as HTMLInputElement
  // )?.checked;

  const [[tab]] = await Promise.all([
    chrome.tabs.query({ active: true, currentWindow: true }),
    chrome.storage.sync.set({
      [STORAGE_KEY]: {
        postsNumber: posts,
        // hideForwarded,
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
};
