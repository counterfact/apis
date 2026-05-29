import type { reposCreateDispatchEvent } from "../../../../types/paths/repos/{owner}/{repo}/dispatches.types.js";

export const POST: reposCreateDispatchEvent = async ($) => {
  return $.response[204].empty();
};
