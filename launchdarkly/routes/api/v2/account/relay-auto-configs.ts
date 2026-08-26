import type { getRelayProxyConfigs } from "../../../../types/paths/api/v2/account/relay-auto-configs.types.js";
import type { postRelayAutoConfig } from "../../../../types/paths/api/v2/account/relay-auto-configs.types.js";

export const GET: getRelayProxyConfigs = async ($) => {
  return $.response[200].random();
};

export const POST: postRelayAutoConfig = async ($) => {
  return $.response[201].random();
};
