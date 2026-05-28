import type { reposCheckAutomatedSecurityFixes } from "../../../../types/paths/repos/{owner}/{repo}/automated-security-fixes.types.js";
import type { reposEnableAutomatedSecurityFixes } from "../../../../types/paths/repos/{owner}/{repo}/automated-security-fixes.types.js";
import type { reposDisableAutomatedSecurityFixes } from "../../../../types/paths/repos/{owner}/{repo}/automated-security-fixes.types.js";

export const GET: reposCheckAutomatedSecurityFixes = async ($) => {
  return $.response[200].random();
};

export const PUT: reposEnableAutomatedSecurityFixes = async ($) => {
  return $.response[204].empty();
};

export const DELETE: reposDisableAutomatedSecurityFixes = async ($) => {
  return $.response[204].empty();
};
