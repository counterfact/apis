import type { credentialsRevoke } from "../../types/paths/credentials/revoke.types.js";

export const POST: credentialsRevoke = async ($) => {
  return $.response[202].empty();
};
