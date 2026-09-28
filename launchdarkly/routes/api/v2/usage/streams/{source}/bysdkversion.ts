import type { getStreamUsageBySdkVersion } from "../../../../../../types/paths/api/v2/usage/streams/{source}/bysdkversion.types.js";

export const GET: getStreamUsageBySdkVersion = async ($) => {
  return $.response[200].random();
};
