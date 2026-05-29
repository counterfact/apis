import type { secretScanningCreatePushProtectionBypass } from "../../../../../types/paths/repos/{owner}/{repo}/secret-scanning/push-protection-bypasses.types.js";

export const POST: secretScanningCreatePushProtectionBypass = async ($) => {
  return $.response[200].random();
};
