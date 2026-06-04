export type Data = {
  postsNumber: number;
  hideForwarded: boolean;
};

export const hidePostsBoardByReplies = (storageKey: string) => {
  chrome.storage.sync.get(storageKey).then((data) => {
    document.querySelectorAll("div.post").forEach((element) => {
      const repliesSection = element.querySelector(".post__refmap");
      const repliesCount =
        repliesSection?.querySelectorAll(".post-reply-link").length ?? 99;
      const hiddenClassName = "post_type_hidden";

      const postNumber = (data["data"] as Data).postsNumber;

      if (postNumber <= repliesCount) {
        element.classList.remove(hiddenClassName);
      } else {
        element.classList.add(hiddenClassName);
      }
    });
  });
};

export const hidePosts4BoardByReplies = (storageKey: string) => {
  chrome.storage.sync.get(storageKey).then((data) => {
    document.querySelectorAll("div.postContainer").forEach((element) => {
      const repliesSection = element.querySelector(".backlink");
      const repliesCount =
        repliesSection?.querySelectorAll(".quotelink").length ?? 99;
      const hiddenClass = "post-hidden";

      const postNumber = (data["data"] as Data).postsNumber;

      if (postNumber <= repliesCount) {
        element.classList.remove(hiddenClass);
      } else {
        element.classList.add(hiddenClass);
      }
    });
  });
};

export const filterPostsByReactions = (storageKey: string) => {
  const getReactionNumber = (text: string) =>
    parseFloat(text) * (text.includes("K") ? 1000 : 1);

  chrome.storage.sync.get(storageKey).then((data) => {
    const processMessage = (messageElement: Element): void => {
      const isForwared = !!messageElement.querySelector(".is-forwarded");

      const reactionsElements = messageElement.querySelectorAll("button");
      const reactionsCount = Array.prototype.reduce.call(
        reactionsElements,
        (sum, reaction) =>
          ((sum as number) += getReactionNumber(reaction.textContent || "0")),
        0,
      ) as number;

      console.log(reactionsCount, reactionsElements);

      if (
        ((data["data"] as Data).hideForwarded && isForwared) ||
        reactionsCount < (data["data"] as Data).postsNumber
      ) {
        messageElement.setAttribute("hidden", "");
      } else {
        messageElement.removeAttribute("hidden");
      }
    };

    document.querySelectorAll("div.Message").forEach(processMessage);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            node.querySelectorAll("div.Message").forEach(processMessage);
          }
        }
      }
    });

    const container = document;
    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true,
      });
    }
  });
};

export const filterVideosByViews = (storageKey: string) => {
  chrome.storage.sync.get(storageKey).then((data) => {
    const checkVideo = (element: Element): void => {
      const viewCountData = element
        .querySelectorAll("span.ytAttributedStringHost")[1]
        ?.textContent?.split("\xa0");

      if (viewCountData) {
        const postsNumber = (data["data"] as Data).postsNumber;
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

    document.querySelectorAll("div.ytd-rich-item-renderer").forEach(checkVideo);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            node
              .querySelectorAll("div.ytd-rich-item-renderer")
              .forEach(checkVideo);
          }
        }
      }
    });

    const container = document.querySelector("#contents");
    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true,
      });
    }
  });
};

export const hideNoize = (storageKey: string) => {
  chrome.storage.sync.get(storageKey).then(() => {
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

    document.querySelectorAll(".tile-root").forEach(cleanTile);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            node.querySelectorAll(".tile-root").forEach(cleanTile);
          }
        }
      }
    });

    const container = document.querySelector("#contentScrollPaginator");
    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true,
      });
    }
  });
};
