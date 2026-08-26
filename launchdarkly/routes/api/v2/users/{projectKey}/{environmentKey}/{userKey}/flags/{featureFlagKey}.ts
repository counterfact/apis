import type { getUserFlagSetting } from "../../../../../../../../types/paths/api/v2/users/{projectKey}/{environmentKey}/{userKey}/flags/{featureFlagKey}.types.js";
import type { putFlagSetting } from "../../../../../../../../types/paths/api/v2/users/{projectKey}/{environmentKey}/{userKey}/flags/{featureFlagKey}.types.js";

export const GET: getUserFlagSetting = async ($) => {
  return $.response[200].random();
};

export const PUT: putFlagSetting = async ($) => {
  return $.response[204].empty();
};
