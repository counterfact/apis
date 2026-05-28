import type { codeSecurityAttachConfiguration } from "../../../../../../types/paths/orgs/{org}/code-security/configurations/{configuration_id}/attach.types.js";

export const POST: codeSecurityAttachConfiguration = async ($) => {
  return $.response[202].empty();
};
