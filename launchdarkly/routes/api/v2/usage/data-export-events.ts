import type { getDataExportEventsUsage } from "../../../../types/paths/api/v2/usage/data-export-events.types.js";

export const GET: getDataExportEventsUsage = async ($) => {
  return $.response[200].random();
};
