import type { resetRelayAutoConfig } from "../../../../../../types/paths/api/v2/account/relay-auto-configs/{id}/reset.types.js";

export const POST: resetRelayAutoConfig = async ($) => {
  return $.response[200].random();
};
