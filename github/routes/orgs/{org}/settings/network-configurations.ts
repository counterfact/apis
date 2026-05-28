import type { hostedComputeListNetworkConfigurationsForOrg } from "../../../../types/paths/orgs/{org}/settings/network-configurations.types.js";
import type { hostedComputeCreateNetworkConfigurationForOrg } from "../../../../types/paths/orgs/{org}/settings/network-configurations.types.js";

export const GET: hostedComputeListNetworkConfigurationsForOrg = async ($) => {
  return $.response[200].random();
};

export const POST: hostedComputeCreateNetworkConfigurationForOrg = async (
  $,
) => {
  return $.response[201].random();
};
