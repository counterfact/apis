import type { reposTransfer } from "../../../../types/paths/repos/{owner}/{repo}/transfer.types.js";

export const POST: reposTransfer = async ($) => {
  return $.response[202].random();
};
