import type { getStreamUsageSdkversion } from "../../../../../../types/paths/api/v2/usage/streams/{source}/sdkversions.types.js";

export const GET: getStreamUsageSdkversion = async ($) => {
  return $.response[200].random();
};
