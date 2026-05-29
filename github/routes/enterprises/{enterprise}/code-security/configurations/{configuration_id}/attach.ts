import type { codeSecurityAttachEnterpriseConfiguration } from "../../../../../../types/paths/enterprises/{enterprise}/code-security/configurations/{configuration_id}/attach.types.js";

export const POST: codeSecurityAttachEnterpriseConfiguration = async ($) => {
  return $.response[202].empty();
};
