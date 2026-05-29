import type { hostedComputeGetNetworkConfigurationForOrg } from "../../../../../types/paths/orgs/{org}/settings/network-configurations/{network_configuration_id}.types.js";
import type { hostedComputeUpdateNetworkConfigurationForOrg } from "../../../../../types/paths/orgs/{org}/settings/network-configurations/{network_configuration_id}.types.js";
import type { hostedComputeDeleteNetworkConfigurationFromOrg } from "../../../../../types/paths/orgs/{org}/settings/network-configurations/{network_configuration_id}.types.js";

export const GET: hostedComputeGetNetworkConfigurationForOrg = async ($) => {
  return $.response[200].random();
};

export const PATCH: hostedComputeUpdateNetworkConfigurationForOrg = async (
  $,
) => {
  return $.response[200].random();
};

export const DELETE: hostedComputeDeleteNetworkConfigurationFromOrg = async (
  $,
) => {
  return $.response[204].empty();
};
