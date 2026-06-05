export const STORAGE_KEY = "data";

type messageType = "FILTER_POSTS";

export type Data = {
  type: messageType;
  postsNumber: number;
  hideForwarded: boolean;
};
