import type { reposGenerateReleaseNotes } from "../../../../../types/paths/repos/{owner}/{repo}/releases/generate-notes.types.js";

export const POST: reposGenerateReleaseNotes = async ($) => {
  return $.response[200].random();
};
