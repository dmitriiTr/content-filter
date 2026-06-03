type Data = {
  postsNumber: number;
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

      console.log(element, repliesCount);

      if (postNumber <= repliesCount) {
        element.classList.remove(hiddenClass);
      } else {
        element.classList.add(hiddenClass);
      }
    });
  });
};

export const filterPostsByReactions = (storageKey: string) => {
  // const getReactionNumber = (text: string) =>
  //   parseFloat(text) * (text.includes("K") ? 1000 : 1);

  chrome.storage.sync.get(storageKey).then(() => {
    document.querySelectorAll("div.Message").forEach((element) => {
      const isForwared =
        !!element.getElementsByClassName("is-forwarded").length;

      const reactionsElements = element.querySelectorAll("button");
      // const reactionsCount = Array.prototype.reduce.call(
      //   reactionsElements,
      //   (sum, reaction) =>
      //     (sum += getReactionNumber(reaction.textContent || "0")),
      //   0,
      // );

      console.log(isForwared, reactionsElements.length);

      // if (
      //   (data.hideForwarded && isForwared) ||
      //   reactionsCount < data.postNumber
      // ) {
      //   element.setAttribute("hidden", "");
      // } else {
      //   element.removeAttribute("hidden");
      // }
    });
  });
};

export const filterVideosByViews = (storageKey: string) => {
  chrome.storage.sync.get(storageKey).then((data) => {
    document
      .querySelectorAll("div.ytd-rich-item-renderer")
      .forEach((element) => {
        const viewCountData = element
          .querySelectorAll("span")[1]
          ?.textContent?.split("\xa0");

        console.log(viewCountData, element);

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
      });
  });
};
