import type { searchTopics } from "../../types/paths/search/topics.types.js";

export const GET: searchTopics = async ($) => {
  return $.response[200].json($.context.searchTopics($.query));
};
