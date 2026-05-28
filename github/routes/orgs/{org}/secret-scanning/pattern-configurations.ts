import type { secretScanningListOrgPatternConfigs } from "../../../../types/paths/orgs/{org}/secret-scanning/pattern-configurations.types.js";
import type { secretScanningUpdateOrgPatternConfigs } from "../../../../types/paths/orgs/{org}/secret-scanning/pattern-configurations.types.js";

export const GET: secretScanningListOrgPatternConfigs = async ($) => {
  return $.response[200].random();
};

export const PATCH: secretScanningUpdateOrgPatternConfigs = async ($) => {
  return $.response[200].random();
};
