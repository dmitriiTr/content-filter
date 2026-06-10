import type { Data, UsedUrl } from "./constants";

export const hidePostsBoardByReplies = (postsNumber: number) => {
  document.querySelectorAll("div.post").forEach((element) => {
    const repliesSection = element.querySelector(".post__refmap");
    const repliesCount =
      repliesSection?.querySelectorAll(".post-reply-link").length ?? 99;
    const hiddenClassName = "post_type_hidden";

    if (postsNumber <= repliesCount) {
      element.classList.remove(hiddenClassName);
    } else {
      element.classList.add(hiddenClassName);
    }
  });
};

export const hidePosts4BoardByReplies = (postsNumber: number) => {
  document.querySelectorAll("div.postContainer").forEach((element) => {
    const repliesSection = element.querySelector(".backlink");
    const repliesCount =
      repliesSection?.querySelectorAll(".quotelink").length ?? 99;
    const hiddenClassName = "post-hidden";

    if (postsNumber <= repliesCount) {
      element.classList.remove(hiddenClassName);
    } else {
      element.classList.add(hiddenClassName);
    }
  });
};

export const filterPostsByReactions = (
  postsNumber: number,
  hideForwarded: boolean,
) => {
  const getReactionNumber = (text: string) =>
    parseFloat(text) * (text.includes("K") ? 1000 : 1);

  const processMessage = (messageElement: Element): void => {
    const isForwared = !!messageElement.querySelector(".is-forwarded");

    const reactionsElements = messageElement.querySelectorAll("button");
    const reactionsCount = Array.prototype.reduce.call(
      reactionsElements,
      (sum, reaction) =>
        ((sum as number) += getReactionNumber(reaction.textContent || "0")),
      0,
    ) as number;

    if ((hideForwarded && isForwared) || reactionsCount < postsNumber) {
      messageElement.setAttribute("hidden", "");
    } else {
      messageElement.removeAttribute("hidden");
    }
  };

  processAndWatch("body", "div.Message", processMessage);
};

export const filterVideosByViews = (postsNumber: number) => {
  const checkVideo = (element: Element): void => {
    const viewCountData = element
      .querySelectorAll("span.ytAttributedStringHost")[1]
      ?.textContent?.split("\xa0");

    if (viewCountData) {
      const viewNumber = parseInt(viewCountData[0] || "0");
      const orderOfMagnitude = viewCountData[1]?.includes(".")
        ? 10 ** 3
        : viewCountData[1]?.includes(" ")
          ? 10 ** 6
          : 1; // looking for thousands and millions
      const totalViewsNumber = viewNumber * orderOfMagnitude;

      if (totalViewsNumber < postsNumber) {
        element.setAttribute("hidden", "");
      } else {
        element.removeAttribute("hidden");
      }
    }
  };

  processAndWatch("#contents", "div.ytd-rich-item-renderer", checkVideo);
};

export const hideNoize = () => {
  const cleanTile = (tile: Element) => {
    tile.querySelector("section")?.setAttribute("hidden", "");
    tile
      .querySelector(".tsHeadline500Medium")
      ?.setAttribute(
        "style",
        "-webkit-text-fill-color: var(--bgActionPrimary) !important; background-image: none !important",
      );

    tile.querySelectorAll(".tsBodyControl400Small").forEach((infoElement) => {
      infoElement.setAttribute("hidden", "");
    });
  };

  processAndWatch("#contentScrollPaginator", ".tile-root", cleanTile);
};

let observer: MutationObserver | null = null;

export const processAndWatch = (
  scrollContainerSelector: string,
  elementSelector: string,
  processFn: (element: Element) => void,
) => {
  const container = document.querySelector(scrollContainerSelector);
  if (!container) {
    return;
  }

  container.querySelectorAll(elementSelector).forEach(processFn);

  if (observer) {
    observer.disconnect();
  }

  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLElement) {
          node.querySelectorAll(elementSelector).forEach(processFn);
        }
      }
    }
  });

  observer.observe(container, {
    childList: true,
    subtree: true,
  });
};

const urlToMethod: Record<
  UsedUrl,
  (postsNumber: number, hideForwarded: boolean) => void
> = {
  "web.telegram.org": filterPostsByReactions,
  "www.youtube.com": filterVideosByViews,
  "boards.4chan.org": hidePosts4BoardByReplies,
  "2ch.su": hidePostsBoardByReplies,
  "www.ozon.ru": hideNoize,
};

const init = () => {
  chrome.runtime.onMessage.addListener((msg: Data) => {
    if (msg.type === "FILTER_POSTS") {
      const url = (location.href || "").split("/").at(2) as UsedUrl;
      const method = urlToMethod[url] ?? hidePostsBoardByReplies;
      method(msg.postsNumber, msg.hideForwarded);
    }
  });
};

init();
