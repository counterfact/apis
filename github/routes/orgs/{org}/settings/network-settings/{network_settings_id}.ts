import type { hostedComputeGetNetworkSettingsForOrg } from "../../../../../types/paths/orgs/{org}/settings/network-settings/{network_settings_id}.types.js";

export const GET: hostedComputeGetNetworkSettingsForOrg = async ($) => {
  return $.response[200].random();
};
