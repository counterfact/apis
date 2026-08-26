import type { postExtinction } from "../../../../../../../../types/paths/api/v2/code-refs/repositories/{repo}/branches/{branch}/extinction-events.types.js";

export const POST: postExtinction = async ($) => {
  return $.response[200].empty();
};
