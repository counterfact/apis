import type { gitUpdateRef } from "../../../../../../types/paths/repos/{owner}/{repo}/git/refs/{ref}.types.js";
import type { gitDeleteRef } from "../../../../../../types/paths/repos/{owner}/{repo}/git/refs/{ref}.types.js";

export const PATCH: gitUpdateRef = async ($) => {
  return $.response[200].random();
};

export const DELETE: gitDeleteRef = async ($) => {
  return $.response[204].empty();
};
