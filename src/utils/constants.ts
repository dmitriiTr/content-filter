export const STORAGE_KEY = "data";

type messageType = "FILTER_POSTS";

export type UsedUrl =
  | "web.telegram.org"
  | "www.youtube.com"
  | "boards.4chan.org"
  | "2ch.su"
  | "www.ozon.ru";

export type Data = {
  type: messageType;
  postsNumber: number;
  hideForwarded: boolean;
};

type SiteInfo = {
  name: string;
  hideForwardedText?: string;
  hidePostsText?: string;
  buttonText?: string;
};

export const urlToInfo: Record<UsedUrl, SiteInfo> = {
  "web.telegram.org": {
    name: "Telegram",
    hidePostsText: "Posts with less reactions than set will be hidden",
    hideForwardedText: "Forwarded posts will be hidden",
  },
  "www.youtube.com": {
    name: "Youtube",
    hidePostsText:
      "Videos with less views than set ([channel]/videos page) will be hidden",
  },
  "boards.4chan.org": {
    name: "4chan",
    hidePostsText: "Posts with less reactions than set will be hidden",
  },
  "2ch.su": {
    name: "2ch",
    hidePostsText: "Posts with less reactions than set will be hidden",
  },
  "www.ozon.ru": {
    name: "Ozon",
    buttonText: "Hides all noize from tile",
  },
};
