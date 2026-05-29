import type { gitGetRef } from "../../../../../../types/paths/repos/{owner}/{repo}/git/ref/{ref}.types.js";

export const GET: gitGetRef = async ($) => {
  return $.response[200].random();
};
