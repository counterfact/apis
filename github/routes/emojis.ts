import type { emojisGet } from "../types/paths/emojis.types.js";

export const GET: emojisGet = async ($) => {
  return $.response[200].random();
};
