import type { getIps } from "../../../types/paths/api/v2/public-ip-list.types.js";

export const GET: getIps = async ($) => {
  return $.response[200].random();
};
